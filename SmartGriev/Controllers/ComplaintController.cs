using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

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
    }
}
