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
            var categoryName = await _ai.DetectCategory(dto.Description ?? "");
            if (string.IsNullOrEmpty(categoryName))
            {
                categoryName = "General";
            }

            var category = await _context.ComplaintCategories.FirstOrDefaultAsync(c => c.CategoryName.ToLower() == categoryName.ToLower());

            if (category == null)
            {
                return new { message = "Category not found from AI classification" };
            }
            Console.WriteLine("AI Category: " + categoryName);

            var complaint = new Complaint
            {
                ComplaintNumber = "CMP" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                UserId = dto.UserId,
                DepartmentId = category.DepartmentId,
                CategoryId = category.CategoryId,
                Description = dto.Description ?? "",
                PriorityLevel = dto.PriorityLevel ?? "",
                Status = "Submitted",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            //var location = new ComplaintLocation
            //{
            //    ComplaintId = complaint.ComplaintId,
            //    Address = dto.Address,
            //    Latitude = 0,
            //    Longitude = 0
            //};

            //location Latitude and logitude storing 
            decimal lat = 0;
            decimal lng = 0;

            if (!string.IsNullOrEmpty(dto.Address))
            {
                using var client = new HttpClient();

                client.DefaultRequestHeaders.UserAgent.ParseAdd("SmartGrievApp");

                var url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(dto.Address)}&format=json&limit=1";

                var response = await client.GetStringAsync(url);
                Console.WriteLine(url);
                Console.WriteLine(response);

                var data = JsonDocument.Parse(response).RootElement;

                if (data.GetArrayLength() > 0)
                {
                    lat = decimal.Parse(data[0].GetProperty("lat").GetString() ?? "0", System.Globalization.CultureInfo.InvariantCulture);
                    lng = decimal.Parse(data[0].GetProperty("lon").GetString() ?? "0", System.Globalization.CultureInfo.InvariantCulture);
                }
                Console.WriteLine($"Latitude: {lat} Longitude: {lng}");
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
                {
                    Directory.CreateDirectory(uploadPath);
                }

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

            var sla = await _context.SlaMasters.FirstOrDefaultAsync(s => s.DepartmentId == category.DepartmentId && s.CategoryId == category.CategoryId && s.PriorityLevel.ToLower() == (dto.PriorityLevel ?? "Medium").ToLower());

            if (sla != null)
            {
                var now = DateTime.Now;

                var slaTracking = new SLA_Tracking
                {
                    ComplaintId = complaint.ComplaintId,
                    SlaId = sla.SlaId,
                    AssignedAt = now,
                    ResolutionDue = now.AddHours(sla.ResolutionHours),
                    EscalationDue = now.AddHours(sla.EscalationHours)
                };

                _context.SLA_Trackings.Add(slaTracking);
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
    }
}
