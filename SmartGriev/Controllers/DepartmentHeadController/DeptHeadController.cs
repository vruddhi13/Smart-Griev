using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.DepartmentHeadController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeptHeadController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;

        public DeptHeadController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignComplaint(
           [FromBody] AssignComplaintDTO model)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c =>
                    c.ComplaintId == model.ComplaintId);

            if (complaint == null)
                return NotFound("Complaint not found");

            var oldStatus = complaint.Status;

            complaint.AssignedTo = model.OfficerId;
            complaint.Status = "Assigned";
            complaint.UpdatedAt = DateTime.Now;

            // Assignment Log
            _context.ComplaintAssignments.Add(
                new ComplaintAssignment
                {
                    ComplaintId = model.ComplaintId,
                    AssignedTo = model.OfficerId,
                    AssignedBy = model.AdminId,
                    AssignmentStatus = model.ForceReassign
                        ? "Reassigned"
                        : "Assigned",

                    Remarks = model.Remarks,
                    AssignedAt = DateTime.Now
                });

            // Status Log
            _context.ComplaintStatusLogs.Add(
                new ComplaintStatusLog
                {
                    ComplaintId = model.ComplaintId,
                    OldStatus = oldStatus,
                    NewStatus = "Assigned",
                    ChangedBy = model.AdminId,
                    Remarks = model.Remarks,
                    ChangedAt = DateTime.Now
                });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = model.ForceReassign
                    ? "Complaint reassigned successfully"
                    : "Complaint assigned successfully"
            });
        }

        // ==============================
        // GET DEPARTMENT COMPLAINTS
        // ==============================
        [HttpGet("department-complaints/{departmentId}")]
        public async Task<IActionResult> GetDepartmentComplaints(int departmentId)
        {
            var complaints = await _context.Complaints
                .Where(c => c.DepartmentId == departmentId)
                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    complaintNumber = c.ComplaintNumber,
                    userName = c.User.FullName,
                    departmentName = c.Department.DepartmentName,
                    categoryName = c.Category.CategoryName,
                    location = c.ComplaintLocations,
                    priorityLevel = c.PriorityLevel,
                    status = c.Status,
                    createdAt = c.CreatedAt,
                    assignedTo = c.AssignedTo,
                    assignedToName = c.AssignedToNavigation != null
    ? c.AssignedToNavigation.FullName
    : null
                })
                .ToListAsync();

            return Ok(complaints);
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }


        [HttpGet("escalated-complaints")]
        public IActionResult GetEscalatedComplaints()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var complaints = _context.Complaints

                .Include(c => c.User)
                .Include(c => c.Category)
                .Include(c => c.Department)
                .Include(c => c.AssignedToNavigation)

                .Where(c =>
                    c.IsActive == true &&
                    c.EscalatedTo == userId
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
        public IActionResult GetComplaintDetailsDeptHead(int complaintId)
        {
            var data = _context.Complaints
                .Where(c => c.ComplaintId == complaintId)
                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    complaintNumber = c.ComplaintNumber,

                    description = c.Description,
                    status = c.Status,
                    priorityLevel = c.PriorityLevel,

                    userName = c.User.FullName,
                    departmentName = c.Department.DepartmentName,
                    categoryName = c.Category.CategoryName,

                    assignedToName =
                        c.AssignedToNavigation != null
                            ? c.AssignedToNavigation.FullName
                            : "-",

                    escalatedToName =
                        c.EscalatedToNavigation != null
                            ? c.EscalatedToNavigation.FullName
                            : "-",

                    createdAt = c.CreatedAt,
                    updatedAt = c.UpdatedAt,
                    slaDueTime = c.SlaDueTime,
                    resolvedAt = c.ResolvedAt,
                    closedAt = c.ClosedAt,
                    isActive = c.IsActive,

                    images = _context.ComplaintImages
                        .Where(i => i.ComplaintId == c.ComplaintId)
                        .Select(i => i.FilePath)
                        .ToList(),

                    location = _context.ComplaintLocations
                        .Where(l => l.ComplaintId == c.ComplaintId)
                        .Select(l => new
                        {
                            latitude = l.Latitude,
                            longitude = l.Longitude,
                            address = l.Address
                        })
                        .FirstOrDefault()
                })
                .FirstOrDefault();

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        [HttpGet("complaint-history/{complaintId}")]
        public IActionResult GetComplaintHistory(int complaintId)
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