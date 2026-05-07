using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.DepartmentHeadController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeptHeadController : ControllerBase
    {
        private readonly Ict2smartGrievDbContext _context;

        public DeptHeadController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }
        [HttpPost("depthead-assign")]
        public async Task<IActionResult> DeptHeadAssign([FromBody] AssignComplaintDTO model)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c => c.ComplaintId == model.ComplaintId);

            if (complaint == null) return NotFound("Complaint not found");

            var oldStatus = complaint.Status;

            complaint.AssignedTo = model.OfficerId;
            complaint.Status = "Assigned";
            complaint.UpdatedAt = DateTime.Now;

            _context.ComplaintAssignments.Add(new ComplaintAssignment
            {
                ComplaintId = model.ComplaintId,
                AssignedTo = model.OfficerId,
                AssignedBy = model.AdminId,
                AssignmentStatus = model.ForceReassign ? "Reassigned" : "Assigned",
                Remarks = "Assigned by Department Head: " + model.Remarks,
                AssignedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Complaint assigned by Dept Head successfully" });
        }
    }
}
