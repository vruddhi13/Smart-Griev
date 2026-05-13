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
        private readonly IConfiguration _configuration;

        public ComplaintRepository(Ict2smartGrievDbContext context, HuggingFaceAIService ai, IConfiguration configuration)
        {
            _context = context;
            _ai = ai;
            _configuration = configuration;
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

            //Duplicate Complaints 
            var desc = dto.Description?.ToLower().Trim() ?? "";

            var isDuplicate = await _context.Complaints.AnyAsync(c =>
                c.UserId == dto.UserId &&
                c.CategoryId == dto.CategoryId &&
                c.CreatedAt >= DateTime.Now.AddMinutes(-10) && // time window
                c.Description.ToLower().Contains(desc.Substring(0, Math.Min(20, desc.Length)))
            );

            if (isDuplicate)
            {
                return new
                {
                    message = "Similar complaint already submitted recently"
                };
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

            if (!string.IsNullOrWhiteSpace(dto.Address))
            {
                try
                {
                    using var client = new HttpClient();

                    string fullAddress = $"{dto.Address}, Surat, Gujarat, India";

                    string apiKey = _configuration["Geoapify:ApiKey"];

                    var url =
                        $"https://api.geoapify.com/v1/geocode/search?" +
                        $"text={Uri.EscapeDataString(fullAddress)}" +
                        $"&apiKey={apiKey}";

                    var response = await client.GetStringAsync(url);

                    var data = JsonDocument.Parse(response).RootElement;

                    var features = data.GetProperty("features");

                    if (features.GetArrayLength() > 0)
                    {
                        var coordinates = features[0]
                            .GetProperty("geometry")
                            .GetProperty("coordinates");

                        lng = Convert.ToDecimal(coordinates[0].GetDouble());

                        lat = Convert.ToDecimal(coordinates[1].GetDouble());
                    }
                    else
                    {
                        Console.WriteLine("Location not found");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Geocoding Error: " + ex.Message);
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
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                var image = new ComplaintImage
                {
                    ComplaintId = complaint.ComplaintId,
                    FileName = fileName,
                    FilePath = "uploads/" + fileName,
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
