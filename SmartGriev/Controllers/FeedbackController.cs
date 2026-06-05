using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs;
using SmartGriev.Models;

namespace SmartGriev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;

        public FeedbackController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback(
            [FromBody] FeedbackDTO dto)
        {
            var feedback = new CitizenFeedback
            {
                ComplaintId = dto.ComplaintId,
                CitizenId = dto.CitizenId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                IsSatisfied = dto.IsSatisfied,
                CreatedAt = DateTime.Now
            };

            _context.CitizenFeedbacks.Add(feedback);

            await _context.SaveChangesAsync();

            var complaint = await _context.Complaints.FindAsync(dto.ComplaintId);

            if (complaint != null)
            {

                var admins = _context.Users
                    .Where(u => u.RoleId == 1)
                    .ToList();

                foreach (var admin in admins)
                {
                    await CreateNotification(
                        admin.UserId,
                        complaint.ComplaintId,
                        "New Feedback Received",
                        $"Citizen submitted feedback for complaint: {complaint.ComplaintNumber}",
                        "Feedback"
                    );
                }
                if (complaint.AssignedTo != null)
                {
                    await CreateNotification(
                        complaint.AssignedTo.Value,
                        complaint.ComplaintId,
                        "Feedback Received",
                        $"Feedback added for complaint: {complaint.ComplaintNumber}",
                        "Feedback"
                    );
                }

                if (complaint.AssignedTo != null)
                {
                    await CreateNotification(
                        complaint.AssignedTo.Value,
                        complaint.ComplaintId,
                        "Citizen Feedback",
                        $"Citizen gave feedback on complaint: {complaint.ComplaintNumber}",
                        "Feedback"
                    );
                }
            }

            return Ok(new
            {
                message = "Feedback submitted successfully"
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, [FromBody] CitizenFeedback updatedFeedback)
        {
            var feedback = await _context.CitizenFeedbacks.FindAsync(id);

            if (feedback == null)
            {
                return NotFound();
            }

            feedback.Rating = updatedFeedback.Rating;
            feedback.Comments = updatedFeedback.Comments;
            feedback.IsSatisfied = updatedFeedback.IsSatisfied;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Feedback updated successfully"
            });
        }

        [HttpGet("{complaintId}")]
        public IActionResult GetFeedback(int complaintId)
        {
            var feedback = _context.CitizenFeedbacks
                .FirstOrDefault(f => f.ComplaintId == complaintId);

            if (feedback == null)
            {
                return NotFound();
            }

            return Ok(feedback);
        }

        private async Task CreateNotification(int userId,int? complaintId,string title,string message,string type)
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
    }
}
