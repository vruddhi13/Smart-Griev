using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.DTOs.OfficerDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System.Text.Json;
using SmartGriev.DTOs.DeptHeadDTO;

namespace SmartGriev.Controllers.DepartmentHeadController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeptHeadController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;
        private readonly IAuditRepository _auditRepo;

        public DeptHeadController(Ict2smartGrievDbContext context, IAuditRepository auditRepo)
        {
            _context = context;
            _auditRepo = auditRepo;
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

            //audit log old data capture
            string oldDataJson = JsonSerializer.Serialize(new
            {
                complaint.ComplaintId,
                complaint.AssignedTo,
                complaint.Status
            });

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

            string newDataJson = JsonSerializer.Serialize(new
            {
                complaint.ComplaintId,
                complaint.AssignedTo,
                complaint.Status
            });

            await _context.SaveChangesAsync();

            var userId = GetUserId();

            if (userId != null)
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                await _auditRepo.AddLog(new AuditLog
                {
                    UserId = userId.Value,
                    ActionType = model.ForceReassign
                        ? "REASSIGN"
                        : "ASSIGN",

                    EntityName = "Complaint",
                    EntityId = complaint.ComplaintId,

                    OldData = oldDataJson,
                    NewData = newDataJson,

                    Description = model.ForceReassign
                        ? $"Complaint reassigned to Officer {model.OfficerId}"
                        : $"Complaint assigned to Officer {model.OfficerId}",

                    IpAddress = ipAddress,
                    UserAgent = Request.Headers["User-Agent"].ToString()
                });
            }

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

        [HttpGet("department-officers/{departmentId}")]
        public IActionResult GetDepartmentOfficers(int departmentId)
        {
            var officers = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .Where(u =>
                    u.DepartmentId == departmentId &&
                    u.Role.RoleName == "Officer" &&
                    u.IsActive == true)
                .Select(u => new
                {
                    userId = u.UserId,
                    fullName = u.FullName,
                    email = u.Email,
                    mobileNo = u.MobileNo,
                    departmentId = u.DepartmentId,
                    departmentName = u.Department.DepartmentName,
                    roleName = u.Role.RoleName
                })
                .ToList();

            return Ok(officers);
        }

        [HttpGet("my-department-officers")]
        public IActionResult GetMyDepartmentOfficers()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var departmentId = _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => u.DepartmentId)
                .FirstOrDefault();

            var officers = _context.Users
                .Include(u => u.Department)
                .Include(u => u.Role)
                .Where(u =>
                    u.DepartmentId == departmentId &&
                    u.Role.RoleName == "Officer")
                .Select(u => new
                {
                    userId = u.UserId,
                    name = u.FullName,
                    email = u.Email,
                    phone = u.MobileNo,
                    departmentName = u.Department.DepartmentName,
                    isActive = u.IsActive
                })
                .ToList();

            return Ok(officers);
        }

        [Authorize]
        [HttpGet("my-department")]
        public IActionResult GetMyDepartment()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = _context.Users
                .Include(u => u.Department)
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    userId = u.UserId,
                    departmentId = u.DepartmentId,
                    departmentName = u.Department.DepartmentName,
                    userName = u.FullName
                })
                .FirstOrDefault();

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [Authorize]
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var departmentId = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => u.DepartmentId)
                .FirstOrDefaultAsync();

            if (departmentId == null)
                return NotFound("Department not found");

            var complaints = _context.Complaints
                .Where(c =>
                    c.DepartmentId == departmentId &&
                    c.IsActive == true);

            var totalComplaints = await complaints.CountAsync();

            var activePending = await complaints
                .CountAsync(c =>
                    c.Status != "Resolved" &&
                    c.Status != "Closed");

            var completed = await complaints
                .CountAsync(c =>
                    c.Status == "Resolved" ||
                    c.Status == "Closed");

            var slaViolations = await complaints
                .CountAsync(c =>
                    c.SlaDueTime < DateTime.Now &&
                    c.Status != "Resolved" &&
                    c.Status != "Closed");

            return Ok(new
            {
                total = totalComplaints,
                pending = activePending,
                resolved = completed,
                overdue = slaViolations
            });
        }

        [Authorize]
        [HttpGet("officer-performance")]
        public async Task<IActionResult> GetOfficerPerformance()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            // 1. Fetch department ID first
            var departmentId = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => u.DepartmentId)
                .FirstOrDefaultAsync();

            // Capture the timestamp once so it can be evaluated as a constant parameter in SQL
            var now = DateTime.Now;

            // 2. Perform a single group-by query to aggregate data on the database side
            var officerMetrics = await _context.Complaints
                .Where(c => c.DepartmentId == departmentId && c.AssignedTo != null)
                .GroupBy(c => c.AssignedTo)
                .Select(g => new
                {
                    OfficerId = g.Key,
                    Assigned = g.Count(),
                    Resolved = g.Count(c => c.Status == "Resolved" || c.Status == "Closed"),
                    Pending = g.Count(c => c.Status != "Resolved" && c.Status != "Closed"),
                    Overdue = g.Count(c => c.SlaDueTime < now && c.Status != "Resolved" && c.Status != "Closed")
                })
                .ToListAsync();

            // 3. Fetch the Officers list to ensure we include officers with 0 assigned complaints
            var officersList = await _context.Users
                .Where(u => u.DepartmentId == departmentId && u.Role.RoleName == "Officer")
                .Select(u => new { u.UserId, u.FullName })
                .ToListAsync();

            // 4. Combine data in memory and calculate performance rankings
            var result = officersList.Select(o =>
            {
                var metrics = officerMetrics.FirstOrDefault(m => m.OfficerId == o.UserId);

                int assigned = metrics?.Assigned ?? 0;
                int resolved = metrics?.Resolved ?? 0;
                int pending = metrics?.Pending ?? 0;
                int overdue = metrics?.Overdue ?? 0;

                string performance = overdue > 5
                    ? "Poor"
                    : pending > resolved
                        ? "Average"
                        : "Good";

                return new
                {
                    officerId = o.UserId,
                    officerName = o.FullName,
                    assigned,
                    resolved,
                    pending,
                    overdue,
                    performance
                };
            });

            return Ok(result);
        }

        [Authorize]
        [HttpGet("sla-health")]
        public async Task<IActionResult> GetSlaHealth()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var departmentId = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => u.DepartmentId)
                .FirstOrDefaultAsync();

            // Aggregate everything directly on the database side using a single conditional Select projection
            var slaSummary = await _context.Complaints
                .Where(c => c.DepartmentId == departmentId && (c.Status == "Resolved" || c.Status == "Closed"))
                .GroupBy(c => 1) // Grouping by a constant aggregates the entire filtered set
                .Select(g => new
                {
                    TotalResolved = g.Count(),
                    WithinSla = g.Count(c => c.ResolvedAt <= c.SlaDueTime)
                })
                .FirstOrDefaultAsync();

            if (slaSummary == null || slaSummary.TotalResolved == 0)
            {
                return Ok(new { totalResolved = 0, withinSla = 0, compliance = 0.0 });
            }

            double compliance = Math.Round((double)slaSummary.WithinSla * 100 / slaSummary.TotalResolved, 2);

            return Ok(new
            {
                totalResolved = slaSummary.TotalResolved,
                withinSla = slaSummary.WithinSla,
                compliance
            });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword( [FromBody] ChangePasswordDTO model)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (user == null)
                return NotFound("User not found");

            if (string.IsNullOrWhiteSpace(model.Password))
                return BadRequest("Password is required");

            // Hash password if your project uses hashing
            user.PasswordHash = model.Password;

            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Password updated successfully"
            });
        }

    }
}