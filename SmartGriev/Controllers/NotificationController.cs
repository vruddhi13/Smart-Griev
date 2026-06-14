using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs;
using SmartGriev.Models;
using Microsoft.EntityFrameworkCore;

namespace SmartGriev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;

        public NotificationController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public IActionResult GetNotifications(int userId)
        {
            var updatedNotifications = _context.Notifications.Where(n => n.UserId == userId).OrderByDescending(n => n.SentAt).Take(20).Select(n => new
            {
                Notification = n,

                Complaint = _context.Complaints
                    .Where(c => c.ComplaintId == n.ComplaintId)
                    .Select(c => new { c.ComplaintNumber, CategoryName = c.Category.CategoryName })
                    .FirstOrDefault(),

                Feedback = _context.CitizenFeedbacks
                    .FirstOrDefault(f => f.ComplaintId == n.ComplaintId)
            })
            .ToList(); 

                var result = updatedNotifications.Select(x =>
                {
                    string smartMessage = x.Notification.Message;

                    if (x.Notification.NotificationType == "Feedback" && x.Feedback != null)
                    {
                        string satisfactionText = x.Feedback.IsSatisfied ? "Satisfied" : "Not Satisfied";
                        smartMessage = $"Feedback received for complaint {x.Complaint?.ComplaintNumber}. " +
                                       $"Rating: {x.Feedback.Rating}/5, Status: {satisfactionText}.";

                        if (!string.IsNullOrWhiteSpace(x.Feedback.Comments))
                        {
                            smartMessage += $" Comment: {x.Feedback.Comments}";
                        }
                    }
                    else if (x.Notification.NotificationType == "Complaint")
                    {
                        smartMessage = $"Complaint update: {x.Complaint?.ComplaintNumber} ({x.Complaint?.CategoryName})";
                    }

                    return new NotificationResponseDTO
                    {
                        NotificationId = x.Notification.NotificationId,
                        Title = x.Notification.Title,
                        Message = smartMessage,
                        NotificationType = x.Notification.NotificationType,
                        IsRead = x.Notification.IsRead,
                        SentAt = x.Notification.SentAt,
                        ComplaintCategory = x.Complaint?.CategoryName, // ✅ This will no longer be null
                        Rating = x.Feedback?.Rating,
                        IsSatisfied = x.Feedback?.IsSatisfied,
                        Comments = x.Feedback?.Comments
                    };
                }).ToList();

                return Ok(result);
        }

        [HttpPut("mark-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications
                .FindAsync(id);

            if (notification == null)
                return NotFound(new
                {
                    message = "Notification not found"
                });

            _context.Notifications.Remove(notification);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Notification deleted successfully"
            });
        }

        [HttpDelete("clear-all/{userId}")]
        public async Task<IActionResult> ClearAllNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .ToListAsync();

            if (!notifications.Any())
            {
                return Ok(new
                {
                    message = "No notifications found"
                });
            }

            _context.Notifications.RemoveRange(notifications);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "All notifications deleted successfully"
            });
        }
    }
}
