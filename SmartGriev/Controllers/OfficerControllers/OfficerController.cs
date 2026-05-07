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
                complaint.ResolvedAt = DateTime.Now;

            if (model.Status == "Closed")
                complaint.ClosedAt = DateTime.Now;

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
            var officerId = GetUserId(); // Get ID of the logged-in officer

            var complaints = _context.Complaints
                .Where(c => c.AssignedTo == officerId && c.IsActive == true)
                .Select(c => new
                {
                    complaint_id = c.ComplaintId,
                    complaint_number = c.ComplaintNumber,
                    description = c.Description,
                    status = c.Status,
                    priority_level = c.PriorityLevel,
                    created_at = c.CreatedAt,
                    category_name = c.Category.CategoryName,
                    // 🛑 IMPORTANT: This joins the Users table to get the Citizen Name
                    citizen_name = c.User.FullName,
                    // 🛑 IMPORTANT: This joins the Location table for the Map
                    location_data = _context.ComplaintLocations
                        .Where(l => l.ComplaintId == c.ComplaintId)
                        .Select(l => new {
                            l.Latitude,
                            l.Longitude,
                            l.Address
                        }).FirstOrDefault(),
                    image = _context.ComplaintImages
                        .Where(i => i.ComplaintId == c.ComplaintId)
                        .Select(i => i.FilePath)
                        .FirstOrDefault()
                })
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

    }
}