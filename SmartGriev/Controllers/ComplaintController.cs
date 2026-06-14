using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Implementations;
using SmartGriev.Repositories.Interfaces;
using System.Text.Json;

namespace SmartGriev.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;
        private readonly IComplaintRepository _repo;
        private readonly IAuditRepository _auditRepo;

        public ComplaintController(IComplaintRepository repo, Ict2smartGrievDbContext context, IAuditRepository auditRepo)
        {
            _context = context;
            _repo = repo;
            _auditRepo = auditRepo;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitComplaint([FromForm] ComplaintDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var result = await _repo.SubmitComplaint(dto);

            //audit log
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string newDataJson = JsonSerializer.Serialize(new
            {
                // Serializing critical fields safely
                dto.CategoryId,
                dto.Description,
                dto.PriorityLevel
            });

            // 3. Save CREATE Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "CREATE",
                EntityName = "Complaint",
                EntityId = null, // Set to result identifier if your SubmitComplaint repo contract exposes it
                OldData = null,
                NewData = newDataJson,
                Description = $"Created a new complaint mapping to Category {dto.CategoryId}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetComplaints()
        {
            var complaints = await _repo.GetComplaints();
            return Ok(complaints);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var data = await _context.ComplaintCategories
                .Where(x => x.IsActive)
                .Select(x => new
                {
                    categoryId = x.CategoryId,
                    categoryName = x.CategoryName
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllComplaints()
        {
            var result = await _repo.GetAllComplaints();
            return Ok(result);
        }

        [HttpGet("dashboard/{userId}")]
        public async Task<IActionResult> GetDashboard(int userId)
        {
            try
            {
                // 1. Fetch all complaints for this specific user
                var complaints = await _context.Complaints
                    .Include(c => c.Category)
                    .Include(c => c.Department)
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                // 2. Prepare the dashboard response
                var dashboardData = new
                {
                    total = complaints.Count,
                    // Adjust these strings ("Pending", "Resolved") to match exactly what's in your Database
                    pending = complaints.Count(c => c.Status == "Submitted" ),
                    inProgress = complaints.Count(c => c.Status == "Assigned" || c.Status == "In Progress"),
                    resolved = complaints.Count(c => c.Status == "Resolved"),

                    // 3. Get only the top 5 for the "Recent" table
                    recentComplaints = complaints.Take(5).Select(c => new
                    {
                        complaintId = c.ComplaintNumber,
                        title = c.Description,
                        status = c.Status,
                        priority = c.PriorityLevel,
                        date = c.CreatedAt,

                        categoryName = c.Category != null
                        ? c.Category.CategoryName
                        : "Unknown Category",

                                        departmentName = c.Department != null
                        ? c.Department.DepartmentName
                        : "Unassigned Department"
                    })
                };

                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserComplaints(int userId)
        {
            var data = await _context.Complaints
                .Where(c => c.UserId == userId)
                .Include(c => c.ComplaintLocations)
                .Include(c => c.ComplaintImages)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    title = c.Category.CategoryName,
                    status = c.Status,
                    priority = c.PriorityLevel,
                    date = c.CreatedAt,
                    description = c.Description,
                    address = c.ComplaintLocations
                                .Select(l => l.Address)
                                .FirstOrDefault(),
                    imageUrl = c.ComplaintImages
                                .Select(i => i.FilePath != null? $"{Request.Scheme}://{Request.Host}/{i.FilePath}": null).FirstOrDefault(),

                    hasFeedback = _context.CitizenFeedbacks.Any(f => f.ComplaintId == c.ComplaintId),

                     assignedOfficerName = _context.ComplaintAssignments
                    .Where(a => a.ComplaintId == c.ComplaintId)
                    .OrderByDescending(a => a.AssignedAt)
                    .Select(a => a.AssignedToNavigation.FullName)
                    .FirstOrDefault(),

                    // ✅ ADD THIS
                    assignedAt = _context.ComplaintAssignments
                    .Where(a => a.ComplaintId == c.ComplaintId)
                    .OrderByDescending(a => a.AssignedAt)
                    .Select(a => a.AssignedAt)
                    .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

            if (!System.IO.File.Exists(path))
                return NotFound("Image not found");

            var ext = Path.GetExtension(fileName).ToLower();

            var contentType = ext switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };

            var bytes = System.IO.File.ReadAllBytes(path);

            return File(bytes, contentType);
        }
        [HttpGet("admin-dashboard")]
        public async Task<IActionResult> GetAdminDashboard([FromQuery] string timeFrame = "year")
        {
            try
            {
                var now = DateTime.Now;
                var today = DateTime.Today;

                // 1. Compute timeframe boundary for chart/trend components
                DateTime chartStartDate = timeFrame.ToLower() switch
                {
                    "week" => today.AddDays(-(int)today.DayOfWeek),
                    "month" => new DateTime(today.Year, today.Month, 1),
                    _ => new DateTime(today.Year, 1, 1)
                };

                // Fixed Baseline for Cards: Always evaluate complaints from the current calendar year
                DateTime globalCardStartDate = new DateTime(today.Year, 1, 1);

                // 2. Fetch all current year complaints to serve the absolute KPI Summary Cards
                var globalComplaints = await _context.Complaints
                    .Include(c => c.Department)
                    .Include(c => c.Category)
                    .Where(c => c.CreatedAt >= globalCardStartDate)
                    .ToListAsync();

                var slas = await _context.SlaMasters
                    .Where(s => s.IsActive)
                    .ToListAsync();

                // Safe SLA duration resolver
                Func<Complaint, int> getSlaHours = (c) =>
                {
                    var sla = slas.FirstOrDefault(s =>
                        s.CategoryId == c.CategoryId &&
                        s.DepartmentId == c.DepartmentId &&
                        s.PriorityLevel == c.PriorityLevel
                    );
                    return sla?.ResolutionHours ?? 72;
                };

                // 🔹 SCOPE A: FIXED SUMMARY CARD STATS (Calculated using globalComplaints)
                var total = globalComplaints.Count;

                var slaBreached = globalComplaints.Count(c =>
                    c.Status != "Resolved" &&
                    c.Status != "Rejected" &&
                    now > c.CreatedAt.AddHours(getSlaHours(c))
                );

                // 1. Near Deadline: Deadline is ahead of us, but within a 24-hour window
                var nearDeadline = globalComplaints.Count(c =>
                    c.Status != "Resolved" &&
                    c.Status != "Rejected" &&
                    c.CreatedAt.AddHours(getSlaHours(c)) > now &&
                    (c.CreatedAt.AddHours(getSlaHours(c)) - now).TotalHours <= 24
                );

                // 2. Resolved Today: Matched safely against local calendar day
                var resolvedToday = globalComplaints.Count(c =>
                    c.Status == "Resolved" &&
                    c.UpdatedAt.HasValue &&
                    c.UpdatedAt.Value.ToLocalTime().Date == today.Date
                );


                // 🔹 SCOPE B: DYNAMIC CHART & BREAKDOWN DATA (Filtered down to the selected timeFrame)
                var filteredComplaints = globalComplaints
                    .Where(c => c.CreatedAt >= chartStartDate)
                    .ToList();

                // Perfect Status Distribution (Updates based on selected filter)
                var statusDistribution = new
                {
                    submitted = filteredComplaints.Count(c => c.Status == "Submitted"),
                    inProgress = filteredComplaints.Count(c => c.Status == "In Progress" || c.Status == "Assigned"),
                    resolved = filteredComplaints.Count(c => c.Status == "Resolved"),
                    rejected = filteredComplaints.Count(c => c.Status == "Rejected")
                };

                // Trend Data (Updates based on selected filter)
                var trendData = filteredComplaints
                    .GroupBy(c => c.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        count = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToList();

                // Recent Complaints Table (Updates based on selected filter)
                var recent = filteredComplaints
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(5)
                    .Select(c => new
                    {
                        complaintId = c.ComplaintId,
                        complaintNumber = c.ComplaintNumber,
                        title = c.Description,
                        dept = c.Department?.DepartmentName ?? "Unassigned",
                        status = c.Status,
                        priority = c.PriorityLevel,
                        time = c.CreatedAt
                    })
                    .ToList();

                // Department Performance Breakdown (Updates based on selected filter)
                var departmentStats = filteredComplaints
                    .Where(c => c.Department != null)
                    .GroupBy(c => c.Department.DepartmentName)
                    .Select(g => new
                    {
                        department = g.Key,
                        total = g.Count(),
                        breach = g.Count(c =>
                            c.Status != "Resolved" &&
                            c.Status != "Rejected" &&
                            now > c.CreatedAt.AddHours(getSlaHours(c))
                        )
                    })
                    .ToList();

                // 3. Construct response object combining static card metrics and fluid trend analysis
                var result = new
                {
                    total,
                    slaBreached,
                    nearDeadline,
                    resolvedToday,
                    statusDistribution,
                    trendData,
                    recent,
                    departmentStats
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("assign-complaint")]
        public async Task<IActionResult> AssignComplaint([FromBody] AssignComplaintDTO model)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.ComplaintId == model.ComplaintId);

            if (complaint == null)
                return NotFound("Complaint not found");
            if (complaint.AssignedTo != null && !model.ForceReassign)
            {
                return BadRequest("Complaint already assigned");
            }

            var oldStatus = complaint.Status;

            string oldDataJson = JsonSerializer.Serialize(new
            {
                complaint.ComplaintId,
                complaint.ComplaintNumber,
                complaint.AssignedTo,
                complaint.Status,
                complaint.UpdatedAt
            });
            // ✅ UPDATE
            complaint.AssignedTo = model.OfficerId;
            complaint.Status = "Assigned";
            complaint.UpdatedAt = DateTime.Now;

            // ✅ ASSIGNMENT LOG
            _context.ComplaintAssignments.Add(new ComplaintAssignment
            {
                ComplaintId = model.ComplaintId,
                AssignedTo = model.OfficerId,
                AssignedBy = model.AdminId,
                AssignmentStatus = model.ForceReassign ? "Reassigned" : "Assigned",
                Remarks = model.Remarks,
                AssignedAt = DateTime.Now
            });

            // ✅ STATUS LOG
            _context.ComplaintStatusLogs.Add(new ComplaintStatusLog
            {
                ComplaintId = model.ComplaintId,
                OldStatus = oldStatus,
                NewStatus = "Assigned",
                ChangedBy = model.AdminId,
                Remarks = model.ForceReassign ? "Reassigned by admin" : "Assigned by admin",
                ChangedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();
            string newDataJson = JsonSerializer.Serialize(new
            {
                complaint.ComplaintId,
                complaint.ComplaintNumber,
                complaint.AssignedTo,
                complaint.Status,
                complaint.UpdatedAt
            });

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            // 3. Save UPDATE Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "UPDATE",
                EntityName = "Complaint",
                EntityId = complaint.ComplaintId,
                OldData = oldDataJson,
                NewData = newDataJson,
                Description = model.ForceReassign
                    ? $"Reassigned complaint {complaint.ComplaintNumber} to officer ID {model.OfficerId}"
                    : $"Assigned complaint {complaint.ComplaintNumber} to officer ID {model.OfficerId}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            // Officer Notification
            // Officer Notification
            await CreateNotification(
                model.OfficerId,
                complaint.ComplaintId,
                "Complaint Assigned",
                $"New complaint assigned: {complaint.ComplaintNumber}",
                "Complaint");
            Console.WriteLine("Creating Officer Notification");
            // Citizen Notification
            await CreateNotification(
                complaint.UserId,
                complaint.ComplaintId,
                "Complaint Assigned",
                $"Your complaint {complaint.ComplaintNumber} has been assigned to an officer.",
                "Complaint");

            var sla = await _context.SlaMasters
                .FirstOrDefaultAsync(s =>
                    s.DepartmentId == complaint.DepartmentId &&
                    s.CategoryId == complaint.CategoryId &&
                    s.PriorityLevel == complaint.PriorityLevel &&
                    s.IsActive);

            if (sla != null)
            {
                await CreateNotification(
                    model.OfficerId,
                    complaint.ComplaintId,
                    "SLA Alert",
                    $"Resolution Time: {sla.ResolutionHours} Hours, Escalation Time: {sla.EscalationHours} Hours",
                    "SLA");

                // Create SLA Tracking
                var tracking = new SLA_Tracking
                {
                    ComplaintId = complaint.ComplaintId,
                    SlaId = sla.SlaId,
                    AssignedAt = DateTime.Now,
                    ResolutionDue = DateTime.Now.AddHours(sla.ResolutionHours),
                    EscalationDue = DateTime.Now.AddHours(sla.EscalationHours),
                    IsEscalated = false
                };


                _context.SLA_Trackings.Add(tracking);

                // Optional: store due date in complaint table
                complaint.SlaDueTime =
                    DateTime.Now.AddHours(sla.ResolutionHours);

                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Complaint assigned successfully"
            });
        }

        [HttpGet("get-officers")]
        public async Task<IActionResult> GetOfficers()
        {
            var officers = await _context.Users
                .Where(u => u.Role.RoleName == "Officer" && !u.IsDeleted && u.IsActive)
                .Select(u => new
                {
                    userId = u.UserId,
                    fullName = u.FullName,
                    email = u.Email,
                    mobileNo = u.MobileNo,
                    role = u.Role.RoleName,
                    departmentId = u.DepartmentId
                })
                .ToListAsync();

            return Ok(officers);
        }

        [HttpGet("complaint-assignments")]
        public IActionResult GetComplaintAssignments()
        {
            var assignments = _context.ComplaintAssignments

                .Include(a => a.Complaint)
                .Include(a => a.AssignedByNavigation)
                    .ThenInclude(u => u.Role)

                .Include(a => a.AssignedToNavigation)
                    .ThenInclude(u => u.Role)

                .OrderByDescending(a => a.AssignedAt)

                .Select(a => new
                {
                    assignmentId = a.AssignmentId,

                    complaintId = a.ComplaintId,

                    complaintNumber = a.Complaint.ComplaintNumber,

                    assignedBy = new
                    {
                        userId = a.AssignedBy,
                        name = a.AssignedByNavigation.FullName,
                        role = a.AssignedByNavigation.Role.RoleName
                    },

                    assignedTo = new
                    {
                        userId = a.AssignedTo,
                        name = a.AssignedToNavigation.FullName,
                        role = a.AssignedToNavigation.Role.RoleName
                    },

                    assignmentStatus = a.AssignmentStatus,

                    remarks = a.Remarks,

                    assignedAt = a.AssignedAt
                })

                .ToList();

            return Ok(assignments);
        }
        private async Task CreateNotification(int userId, int? complaintId, string title, string message, string type)
        {
            var notification = new Notification
            {
                UserId = userId,
                ComplaintId = complaintId,
                Title = title,
                Message = message,
                NotificationType = type,
                IsRead = false,
                SentAt = DateTime.Now
            };

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();
        }

        [HttpGet("notifications/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.SentAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPost("check-sla-reminders")]
        public async Task<IActionResult> CheckSlaReminders()
        {
            var now = DateTime.Now;

            var trackings = await _context.SLA_Trackings
                .Include(t => t.Complaint)
                .ThenInclude(c => c.Department)
                .Where(t =>
                    t.CompletedAt == null &&
                    t.Complaint.Status != "Resolved")
                .ToListAsync();

            foreach (var tracking in trackings)
            {
                var complaint = tracking.Complaint;

                if (complaint == null || complaint.AssignedTo == null)
                    continue;

                // =====================================================
                // 1. SLA REMINDER (Before breach - last 2 hours)
                // =====================================================
                var hoursRemaining = (tracking.ResolutionDue - now).TotalHours;

                if (hoursRemaining <= 2 && hoursRemaining > 0)
                {
                    bool reminderExists = await _context.Notifications.AnyAsync(n =>
                        n.ComplaintId == complaint.ComplaintId &&
                        n.Title == "SLA Reminder");

                    if (!reminderExists)
                    {
                        await CreateNotification(
                            complaint.AssignedTo.Value,
                            complaint.ComplaintId,
                            "SLA Reminder",
                            $"Complaint {complaint.ComplaintNumber} will breach SLA in {Math.Ceiling(hoursRemaining)} hour(s).",
                            "SLA");
                    }
                }

                // =====================================================
                // 2. SLA BREACH (Trigger escalation START here)
                // =====================================================
                if (!tracking.IsEscalated &&
                    !tracking.IsEscalated && // safe double guard
                    now >= tracking.ResolutionDue)
                {
                    // Mark complaint as breached
                    complaint.Status = "SLA Breached";
                    complaint.UpdatedAt = now;

                    // Mark tracking as breached (IMPORTANT FLAG)
                    tracking.IsEscalated = false; // still not escalated yet

                    // START escalation timer ONLY NOW
                    if (tracking.EscalationDue == null)
                    {
                        tracking.EscalationDue = now.AddHours(2); // escalation window starts AFTER breach
                    }

                    bool breachExists = await _context.Notifications.AnyAsync(n =>
                        n.ComplaintId == complaint.ComplaintId &&
                        n.Title == "SLA Breached");

                    if (!breachExists)
                    {
                        await CreateNotification(
                            complaint.AssignedTo.Value,
                            complaint.ComplaintId,
                            "SLA Breached",
                            $"Complaint {complaint.ComplaintNumber} has exceeded SLA resolution time.",
                            "SLA");
                    }
                }

                // =====================================================
                // 3. AUTO ESCALATION (ONLY AFTER BREACH)
                // =====================================================
                if (tracking.EscalationDue.HasValue &&
                    now >= tracking.EscalationDue.Value)
                {
                    tracking.IsEscalated = true;

                    complaint.Status = "Escalated";
                    complaint.UpdatedAt = now;

                    bool escalationExists = await _context.Notifications.AnyAsync(n =>
                        n.ComplaintId == complaint.ComplaintId &&
                        n.Title == "Complaint Escalated");

                    if (!escalationExists)
                    {
                        await CreateNotification(
                            complaint.AssignedTo.Value,
                            complaint.ComplaintId,
                            "Complaint Escalated",
                            $"Complaint {complaint.ComplaintNumber} has been escalated due to SLA breach.",
                            "Escalation");
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "SLA Reminder, Breach and Escalation check completed successfully"
            });

        }
        //complaint Status log 
        [HttpGet("status-logs")]
        public IActionResult GetComplaintStatusLogs()
        {
            var data = _context.ComplaintStatusLogs
                .Include(x => x.Complaint)
                .Include(x => x.ChangedByNavigation)
                    .ThenInclude(x => x.Role)
                .OrderByDescending(x => x.ChangedAt)
                .Select(x => new
                {
                    statusLogId = x.StatusLogId,
                    complaintId = x.ComplaintId,
                    complaintNumber = x.Complaint.ComplaintNumber,

                    oldStatus = x.OldStatus,
                    newStatus = x.NewStatus,

                    remarks = x.Remarks,
                    changedAt = x.ChangedAt,

                    changedBy = new
                    {
                        name = x.ChangedByNavigation.FullName,
                        role = x.ChangedByNavigation.Role.RoleName
                    }
                })
                .ToList();

            return Ok(data);
        }
    }
}
