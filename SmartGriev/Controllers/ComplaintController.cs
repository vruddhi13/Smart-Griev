using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Repositories.Implementations;

namespace SmartGriev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;
        private readonly IComplaintRepository _repo;

        public ComplaintController(IComplaintRepository repo, Ict2smartGrievDbContext context)
        {
            _context = context;
            _repo = repo;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitComplaint([FromForm] ComplaintDTO dto)
        {
            var result = await _repo.SubmitComplaint(dto);

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
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                // 2. Prepare the dashboard response
                var dashboardData = new
                {
                    total = complaints.Count,
                    // Adjust these strings ("Pending", "Resolved") to match exactly what's in your Database
                    pending = complaints.Count(c => c.Status == "Submitted" || c.Status == "Pending"),
                    inProgress = complaints.Count(c => c.Status == "In Progress"),
                    resolved = complaints.Count(c => c.Status == "Resolved"),

                    // 3. Get only the top 5 for the "Recent" table
                    recentComplaints = complaints.Take(5).Select(c => new
                    {
                        complaintId = c.ComplaintNumber,
                        title = c.Description,
                        status = c.Status,
                        priority = c.PriorityLevel,
                        date = c.CreatedAt
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
                                .Select(i => i.FilePath != null? $"{Request.Scheme}://{Request.Host}/{i.FilePath}": null).FirstOrDefault()
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
        public async Task<IActionResult> GetAdminDashboard()
        {
            try
            {
                var complaints = await _context.Complaints
                    .Include(c => c.Department)
                    .Include(c => c.Category)
                    .ToListAsync();

                var slas = await _context.SlaMasters
                    .Where(s => s.IsActive)
                    .ToListAsync();

                var now = DateTime.Now;
                var today = DateTime.Today;

                // 🔹 Helper: Get SLA for a complaint
                Func<Complaint, int> getSlaHours = (c) =>
                {
                    var sla = slas.FirstOrDefault(s =>
                        s.CategoryId == c.CategoryId &&
                        s.DepartmentId == c.DepartmentId &&
                        s.PriorityLevel == c.PriorityLevel
                    );

                    return sla?.ResolutionHours ?? 72; // fallback = 72 hrs (3 days)
                };

                // 🔹 TOP STATS
                var total = complaints.Count;

                var slaBreached = complaints.Count(c =>
                    c.Status != "Resolved" &&
                    now > c.CreatedAt.AddHours(getSlaHours(c))
                );

                var nearDeadline = complaints.Count(c =>
                    c.Status != "Resolved" &&
                    now <= c.CreatedAt.AddHours(getSlaHours(c)) &&
                    now >= c.CreatedAt.AddHours(getSlaHours(c) - 2) // last 2 hours window
                );

                var resolvedToday = complaints.Count(c =>
                    c.Status == "Resolved" &&
                    c.UpdatedAt.HasValue &&
                    c.UpdatedAt.Value.Date == today
                );

                // 🔹 STATUS DISTRIBUTION
                var statusData = complaints
                    .GroupBy(c => c.Status)
                    .Select(g => new
                    {
                        status = g.Key,
                        count = g.Count()
                    });

                // 🔹 TREND DATA (last 7 days)
                var trendData = complaints
                    .Where(c => c.CreatedAt >= now.AddDays(-7))
                    .GroupBy(c => c.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key,
                        count = g.Count()
                    })
                    .OrderBy(x => x.date);

                // 🔹 RECENT COMPLAINTS
                var recent = complaints
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(5)
                    .Select(c => new
                    {
                        title = c.Description,
                        dept = c.Department.DepartmentName,
                        status = c.Status,
                        priority = c.PriorityLevel,
                        time = c.CreatedAt
                    });

                // 🔹 DEPARTMENT PERFORMANCE
                var departmentStats = complaints
                    .GroupBy(c => c.Department.DepartmentName)
                    .Select(g => new
                    {
                        department = g.Key,
                        total = g.Count(),
                        breach = g.Count(c =>
                            c.Status != "Resolved" &&
                            now > c.CreatedAt.AddHours(getSlaHours(c))
                        )
                    });

                var result = new
                {
                    total,
                    slaBreached,
                    nearDeadline,
                    resolvedToday,
                    statusData,
                    trendData,
                    recent,
                    departmentStats
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
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
    }
}
