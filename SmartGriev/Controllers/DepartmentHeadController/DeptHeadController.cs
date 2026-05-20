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

        [HttpPost("assign")]
        public async Task<IActionResult> AssignComplaint(
           [FromBody] AssignComplaintDTO model)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(c =>
                    c.ComplaintId == model.ComplaintId);

            if (complaint == null)
                return NotFound("Complaint not found");

            var oldStatus = complaint.Status;

            complaint.AssignedTo = model.OfficerId;
            complaint.Status = "Assigned";
            complaint.UpdatedAt = DateTime.Now;

            // Assignment Log
            _context.ComplaintAssignments.Add(
                new ComplaintAssignment
                {
                    ComplaintId = model.ComplaintId,
                    AssignedTo = model.OfficerId,
                    AssignedBy = model.AdminId,
                    AssignmentStatus = model.ForceReassign
                        ? "Reassigned"
                        : "Assigned",

                    Remarks = model.Remarks,
                    AssignedAt = DateTime.Now
                });

            // Status Log
            _context.ComplaintStatusLogs.Add(
                new ComplaintStatusLog
                {
                    ComplaintId = model.ComplaintId,
                    OldStatus = oldStatus,
                    NewStatus = "Assigned",
                    ChangedBy = model.AdminId,
                    Remarks = model.Remarks,
                    ChangedAt = DateTime.Now
                });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = model.ForceReassign
                    ? "Complaint reassigned successfully"
                    : "Complaint assigned successfully"
            });
        }

        // ==============================
        // GET DEPARTMENT COMPLAINTS
        // ==============================
        [HttpGet("department-complaints/{departmentId}")]
        public async Task<IActionResult> GetDepartmentComplaints(int departmentId)
        {
            var complaints = await _context.Complaints
                .Where(c => c.DepartmentId == departmentId)
                .Select(c => new
                {
                    complaintId = c.ComplaintId,
                    complaintNumber = c.ComplaintNumber,
                    userName = c.User.FullName,
                    departmentName = c.Department.DepartmentName,
                    categoryName = c.Category.CategoryName,
                    location = c.ComplaintLocations,
                    priorityLevel = c.PriorityLevel,
                    status = c.Status,
                    createdAt = c.CreatedAt,
                    assignedTo = c.AssignedTo,
                    assignedToName = c.AssignedToNavigation != null
    ? c.AssignedToNavigation.FullName
    : null
                })
                .ToListAsync();

            return Ok(complaints);
        }
    }
}