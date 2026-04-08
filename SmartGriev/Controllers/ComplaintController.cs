using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly IComplaintRepository _repo;

        public ComplaintController(IComplaintRepository repo)
        {
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
    }
}
