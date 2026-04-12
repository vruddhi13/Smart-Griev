using Microsoft.EntityFrameworkCore;
using SmartGriev.BackendServices;
using SmartGriev.DTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System.Text.Json;

namespace SmartGriev.Repositories.Implementations
{
    public class ComplaintRepository : IComplaintRepository
    {
        private readonly Ict2smartGrievDbContext _context;
        private readonly HuggingFaceAIService _ai;

        public ComplaintRepository(Ict2smartGrievDbContext context, HuggingFaceAIService ai)
        {
            _context = context;
            _ai = ai;
        }

        public async Task<object> SubmitComplaint(ComplaintDTO dto)
        {
            // ✅ Category from dropdown
            var category = await _context.ComplaintCategories
                .FirstOrDefaultAsync(c => c.CategoryId == dto.CategoryId);

            if (category == null)
            {
                return new { message = "Invalid category" };
            }

            // ✅ AI only for suggestion (not DB)
            var aiSuggestion = await _ai.DetectCategory(dto.Description ?? "");
            Console.WriteLine("AI Suggestion: " + aiSuggestion);

            var complaint = new Complaint
            {
                ComplaintNumber = "CMP" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                UserId = dto.UserId,
                DepartmentId = category.DepartmentId,
                CategoryId = category.CategoryId,
                Description = dto.Description ?? "",
                PriorityLevel = dto.PriorityLevel ?? "Medium",
                Status = "Submitted",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            decimal lat = 0;
            decimal lng = 0;

            if (!string.IsNullOrEmpty(dto.Address))
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.UserAgent.ParseAdd("SmartGrievApp");

                var url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(dto.Address)}&format=json&limit=1";
                var response = await client.GetStringAsync(url);

                var data = JsonDocument.Parse(response).RootElement;

                if (data.GetArrayLength() > 0)
                {
                    lat = decimal.Parse(data[0].GetProperty("lat").GetString() ?? "0",
                        System.Globalization.CultureInfo.InvariantCulture);
                    lng = decimal.Parse(data[0].GetProperty("lon").GetString() ?? "0",
                        System.Globalization.CultureInfo.InvariantCulture);
                }
            }

            var location = new ComplaintLocation
            {
                ComplaintId = complaint.ComplaintId,
                Address = dto.Address,
                Latitude = lat,
                Longitude = lng,
                CreatedAt = DateTime.Now
            };

            _context.ComplaintLocations.Add(location);

            if (dto.Image != null)
            {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, dto.Image.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                var image = new ComplaintImage
                {
                    ComplaintId = complaint.ComplaintId,
                    FileName = dto.Image.FileName,
                    FilePath = "uploads/" + dto.Image.FileName,
                    ImageType = "Complaint",
                    UploadedBy = dto.UserId
                };

                _context.ComplaintImages.Add(image);
            }

            await _context.SaveChangesAsync();

            return new
            {
                message = "Complaint submitted successfully",
                complaintNumber = complaint.ComplaintNumber
            };
        }
        public async Task<List<Complaint>> GetComplaints()
        {
            return await _context.Complaints
                .Include(c => c.ComplaintLocations)
                .Include(c => c.ComplaintImages)
                .ToListAsync();
        }

        public async Task<object> GetAllComplaints()
        {
            var data = await _context.Complaints
                .Include(c => c.User)
                .Include(c => c.Department)
                .Include(c => c.Category)
                .Include(c => c.AssignedToNavigation)
                .Include(c => c.ComplaintLocations) // Include locations for the frontend
                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    complaintNumber = c.ComplaintNumber,
                    userName = c.User.FullName,
                    // ADD THESE TWO LINES:
                    departmentName = c.Department.DepartmentName,
                    categoryName = c.Category.CategoryName,
                    assignedTo = c.AssignedToNavigation != null ? c.AssignedToNavigation.FullName : "Not Assigned",
                    status = c.Status,
                    priorityLevel = c.PriorityLevel,
                    createdAt = c.CreatedAt,
                    // ADD THIS LINE FOR LOCATION:
                    location = c.ComplaintLocations.Select(l => l.Address).FirstOrDefault() ?? "No Location"
                })
                .ToListAsync();

            return data;
        }
    }
}
