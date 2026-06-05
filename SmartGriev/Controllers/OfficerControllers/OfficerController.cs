using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.OfficerDTOs;
using SmartGriev.Models;

namespace SmartGriev.Controllers.OfficerControllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OfficerController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;

        public OfficerController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        // ✅ Get UserId safely
        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }

        // ✅ 1. Get My Complaints
        [HttpGet("my-complaints")]
        public IActionResult GetMyComplaints()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var complaints = _context.Complaints
     .Where(c => c.AssignedTo == userId)
     .Select(c => new
     {
         complaint_id = c.ComplaintId,
         complaint_number = c.ComplaintNumber,
         description = c.Description,
         status = c.Status,
         priority_level = c.PriorityLevel,
         created_at = c.CreatedAt,

         // ✅ Category
         category_name = c.Category.CategoryName,

         // ✅ Citizen Name
         citizen_name = c.User.FullName,

         location_data = _context.ComplaintLocations
    .Where(l => l.ComplaintId == c.ComplaintId)
    .Select(l => new
    {
        latitude = Convert.ToDouble(l.Latitude),
        longitude = Convert.ToDouble(l.Longitude),
        address = l.Address
    })
    .FirstOrDefault(),

         // ✅ Image
         image = _context.ComplaintImages
             .Where(i => i.ComplaintId == c.ComplaintId)
             .Select(i => i.FilePath)
             .FirstOrDefault()
     })
     .ToList();

            return Ok(complaints);
        }

        // ✅ 2. Update Complaint Status
        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusDTO model)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("Invalid user");

            // ✅ Allowed statuses (no helper class)
            var validStatuses = new[]
            {
        "Submitted",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
        "Closed"
    };

            if (!validStatuses.Contains(model.Status))
                return BadRequest("Invalid status value");

            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.ComplaintId == model.ComplaintId);

            if (complaint == null)
                return NotFound("Complaint not found");

            var oldStatus = complaint.Status;

            if (oldStatus == model.Status)
                return BadRequest("Status already same");

            // ✅ Business rules
            if ((model.Status == "Assigned" || model.Status == "In Progress") && complaint.AssignedTo == null)
                return BadRequest("Assign officer first");

            // ✅ Update complaint
            complaint.Status = model.Status;
            complaint.UpdatedAt = DateTime.Now;

            if (model.Status == "Resolved")
            {
                complaint.ResolvedAt = DateTime.Now;
                complaint.ClosedAt = DateTime.Now;

                var tracking = await _context.SLA_Trackings
                    .Where(x =>
                        x.ComplaintId == complaint.ComplaintId &&
                        x.CompletedAt == null)
                    .OrderByDescending(x => x.TrackingId)
                    .FirstOrDefaultAsync();

                if (tracking != null)
                {
                    tracking.CompletedAt = DateTime.Now;

                    tracking.IsEscalated = await _context.EscalationLogs
                        .AnyAsync(x =>
                            x.ComplaintId == complaint.ComplaintId);
                }
            }

            if (model.Status == "Closed")
            {
                complaint.ClosedAt = DateTime.Now;

                var tracking = await _context.SLA_Trackings
                    .Where(x =>
                        x.ComplaintId == complaint.ComplaintId &&
                        x.CompletedAt == null)
                    .OrderByDescending(x => x.TrackingId)
                    .FirstOrDefaultAsync();

                if (tracking != null)
                {
                    tracking.CompletedAt = DateTime.Now;

                    tracking.IsEscalated = await _context.EscalationLogs
                        .AnyAsync(x =>
                            x.ComplaintId == complaint.ComplaintId);
                }
            }

            // ✅ Insert into status log
            _context.ComplaintStatusLogs.Add(new ComplaintStatusLog
            {
                ComplaintId = complaint.ComplaintId,
                OldStatus = oldStatus,
                NewStatus = model.Status,
                ChangedBy = userId.Value,
                Remarks = model.Remarks,
                ChangedAt = DateTime.Now
            });

            // ✅ Update assignment table
            var assignment = await _context.ComplaintAssignments
                .Where(a => a.ComplaintId == model.ComplaintId)
                .OrderByDescending(a => a.AssignedAt)
                .FirstOrDefaultAsync();

            if (assignment != null)
            {
                if (model.Status == "In Progress")
                    assignment.AssignmentStatus = "In Progress";

                else if (model.Status == "Resolved")
                    assignment.AssignmentStatus = "Completed";

                else if (model.Status == "Rejected")
                    assignment.AssignmentStatus = "Rejected";
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully" });
        }

        // ✅ 3. DEBUG API (Remove later)
        [HttpGet("debug-claims")]
        public IActionResult DebugClaims()
        {
            var claims = User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            }).ToList();

            return Ok(claims);
        }

        [HttpPost("update-account")]
        public IActionResult UpdateAccount([FromBody] UpdateAccountDTO model)
        {
            var userId = GetUserId();

            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);

            if (user == null)
                return NotFound("User not found");

            if (!string.IsNullOrEmpty(model.Email))
                user.Email = model.Email;

            if (!string.IsNullOrEmpty(model.Password))
                user.PasswordHash = model.Password;

            if (!string.IsNullOrEmpty(model.MobileNo))
                user.MobileNo = model.MobileNo;

            user.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok(new { message = "Account updated successfully" });
        }

        [HttpGet("notifications")]
        public IActionResult GetNotifications()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var notifications = _context.ComplaintStatusLogs
                .Where(x => x.ChangedBy == userId)
                .OrderByDescending(x => x.ChangedAt)
                .Take(10)
                .Select(x => new
                {
                    message = $"Status changed from {x.OldStatus} to {x.NewStatus}",
                    time = x.ChangedAt
                })
                .ToList();

            return Ok(notifications);
        }

        [HttpGet("complaints")]
        public IActionResult GetComplaints()
        {
            var officerId = GetUserId();

            if (officerId == null)
                return Unauthorized();

            var complaints = _context.Complaints

                .Include(c => c.Category)
                .Include(c => c.User)
                .Include(c => c.AssignedToNavigation)
                    .ThenInclude(x => x.Role)

                .Where(c =>

                    c.IsActive == true &&

                    (
                        c.AssignedTo == officerId ||

                        c.EscalatedTo == officerId
                    )
                )

                .Select(c => new
                {
                    complaint_id = c.ComplaintId,

                    complaint_number = c.ComplaintNumber,

                    description = c.Description,

                    status = c.Status,

                    priority_level = c.PriorityLevel,

                    created_at = c.CreatedAt,

                    category_name = c.Category.CategoryName,

                    citizen_name = c.User.FullName,

                    assigned_to =
                        c.AssignedToNavigation != null
                            ? c.AssignedToNavigation.FullName
                            : "Not Assigned",

                    assigned_role =
                        c.AssignedToNavigation != null &&
                        c.AssignedToNavigation.Role != null

                            ? c.AssignedToNavigation
                                .Role
                                .RoleName

                            : "-",

                    escalated_to = c.EscalatedTo,

                    is_escalated =
                        c.EscalatedTo != null,

                    location_data = _context.ComplaintLocations

                        .Where(l =>
                            l.ComplaintId == c.ComplaintId)

                        .Select(l => new
                        {
                            latitude = l.Latitude,
                            longitude = l.Longitude,
                            address = l.Address
                        })

                        .FirstOrDefault(),

                    image = _context.ComplaintImages

                        .Where(i =>
                            i.ComplaintId == c.ComplaintId)

                        .Select(i => i.FilePath)

                        .FirstOrDefault(),

                    escalation_level =
                        _context.EscalationLogs

                            .Where(e =>
                                e.ComplaintId == c.ComplaintId)

                            .OrderByDescending(e =>
                                e.EscalationLevel)

                            .Select(e =>
                                e.EscalationLevel)

                            .FirstOrDefault()
                })

                .OrderByDescending(c => c.created_at)

                .ToList();

            return Ok(complaints);
        }

        [HttpGet("my-profile")]
        public IActionResult GetMyProfile()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    full_name = u.FullName,
                    email = u.Email,
                    mobile_no = u.MobileNo,
                    role_name =
                        u.RoleId == 1 ? "Admin" :
                        u.RoleId == 2 ? "Department Head" :
                        u.RoleId == 3 ? "Officer" :
                        "Citizen"
                })
                .FirstOrDefault();

            return Ok(user);
        }

        [HttpGet("escalated-complaints")]
        public IActionResult GetEscalatedComplaints()
        {
            var officerId = GetUserId();

            if (officerId == null)
                return Unauthorized();

            var complaints = _context.Complaints

                .Include(c => c.User)
                .Include(c => c.Category)
                .Include(c => c.Department)
                .Include(c => c.AssignedToNavigation)

                .Where(c =>
                    c.IsActive == true &&
                    c.EscalatedTo == officerId
                )

                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    complaintNumber = c.ComplaintNumber,

                    citizenName = c.User.FullName,

                    categoryName = c.Category.CategoryName,

                    departmentName = c.Department.DepartmentName,

                    description = c.Description,

                    status = c.Status,

                    priorityLevel = c.PriorityLevel,

                    createdAt = c.CreatedAt,

                    assignedOfficer =
                        c.AssignedToNavigation != null
                            ? c.AssignedToNavigation.FullName
                            : "-",

                    escalationLevel =
                        _context.EscalationLogs
                            .Where(e => e.ComplaintId == c.ComplaintId)
                            .OrderByDescending(e => e.EscalationLevel)
                            .Select(e => e.EscalationLevel)
                            .FirstOrDefault(),

                    image =
                        _context.ComplaintImages
                            .Where(i => i.ComplaintId == c.ComplaintId)
                            .Select(i => i.FilePath)
                            .FirstOrDefault(),

                    location = _context.ComplaintLocations
    .Where(x => x.ComplaintId == c.ComplaintId)
    .Select(x => new
    {
        x.Latitude,
        x.Longitude,
        x.Address
    })
    .FirstOrDefault(),
                })

                .OrderByDescending(x => x.createdAt)

                .ToList();

            return Ok(complaints);
        }

        [HttpGet("complaint-details/{complaintId}")]
        public IActionResult ComplaintDetails(int complaintId)
        {
            var data = _context.Complaints
                .Where(c => c.ComplaintId == complaintId)
                .Select(c => new
                {
                    c.ComplaintId,
                    c.ComplaintNumber,

                    c.UserId,
                    c.DepartmentId,
                    c.CategoryId,

                    c.PriorityLevel,
                    c.Description,
                    c.Status,

                    c.AssignedTo,
                    c.EscalatedTo,

                    c.SlaDueTime,
                    c.ResolvedAt,
                    c.ClosedAt,

                    c.IsActive,

                    c.CreatedAt,
                    c.UpdatedAt,

                    CitizenName = c.User.FullName,

                    DepartmentName = c.Department.DepartmentName,

                    CategoryName = c.Category.CategoryName,

                    AssignedOfficer =
                        c.AssignedToNavigation != null
                            ? c.AssignedToNavigation.FullName
                            : "-",

                    EscalatedOfficer =
                        c.EscalatedToNavigation != null
                            ? c.EscalatedToNavigation.FullName
                            : "-",

                    Location = _context.ComplaintLocations
                        .FirstOrDefault(x => x.ComplaintId == c.ComplaintId),

                    Images = _context.ComplaintImages
                        .Where(x => x.ComplaintId == c.ComplaintId)
                        .Select(x => x.FilePath)
                        .ToList()
                })
                .FirstOrDefault();

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        [HttpGet("complaint-history/{complaintId}")]
        public IActionResult ComplaintHistory(int complaintId)
        {
            var history = _context.ComplaintStatusLogs
                .Include(x => x.ChangedByNavigation)
                    .ThenInclude(u => u.Role)

                .Where(x => x.ComplaintId == complaintId)
                .OrderByDescending(x => x.ChangedAt)
                .ToList()
                .Select(x =>
                {
                    // GET assignment at time of change (OLD STATE approx)
                    var oldAssignment = _context.ComplaintAssignments
                        .Where(a => a.ComplaintId == complaintId
                                    && a.AssignedAt <= x.ChangedAt)
                        .OrderByDescending(a => a.AssignedAt)
                        .Include(a => a.AssignedToNavigation)
                            .ThenInclude(u => u.Role)
                        .FirstOrDefault();

                    // GET latest assignment after change (NEW STATE approx)
                    var newAssignment = _context.ComplaintAssignments
                        .Where(a => a.ComplaintId == complaintId
                                    && a.AssignedAt >= x.ChangedAt)
                        .OrderBy(a => a.AssignedAt)
                        .Include(a => a.AssignedToNavigation)
                            .ThenInclude(u => u.Role)
                        .FirstOrDefault();

                    return new
                    {
                        oldStatus = new
                        {
                            status = x.OldStatus,

                            user = oldAssignment?.AssignedToNavigation?.FullName,
                            role = oldAssignment?.AssignedToNavigation?.Role?.RoleName,
                            email = oldAssignment?.AssignedToNavigation?.Email,
                            mobile = oldAssignment?.AssignedToNavigation?.MobileNo
                        },

                        newStatus = new
                        {
                            status = x.NewStatus,

                            user = newAssignment?.AssignedToNavigation?.FullName,
                            role = newAssignment?.AssignedToNavigation?.Role?.RoleName,
                            email = newAssignment?.AssignedToNavigation?.Email,
                            mobile = newAssignment?.AssignedToNavigation?.MobileNo
                        },

                        changedBy = new
                        {
                            user = x.ChangedByNavigation?.FullName,
                            role = x.ChangedByNavigation?.Role?.RoleName
                        },

                        changedAt = x.ChangedAt,
                        remarks = x.Remarks
                    };
                })
                .ToList();

            return Ok(history);
        }

    }
}