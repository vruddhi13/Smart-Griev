using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                    category_name = c.Category.CategoryName,

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
        public IActionResult UpdateStatus([FromBody] UpdateStatusDTO model)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("UserId not found in token");

            var complaint = _context.Complaints
                .FirstOrDefault(c => c.ComplaintId == model.ComplaintId);

            if (complaint == null)
                return NotFound("Complaint not found");

            var oldStatus = complaint.Status;

            // 🔄 Update complaint
            complaint.Status = model.Status;
            complaint.UpdatedAt = DateTime.Now;

            // 📝 Insert log
            _context.ComplaintStatusLogs.Add(new ComplaintStatusLog
            {
                ComplaintId = complaint.ComplaintId,
                OldStatus = oldStatus,
                NewStatus = model.Status,
                ChangedBy = userId.Value,
                ChangedAt = DateTime.Now
            });

            _context.SaveChanges();

            return Ok(new
            {
                message = "Status updated successfully"
            });
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

    }
}