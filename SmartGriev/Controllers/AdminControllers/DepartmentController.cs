using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs.Department;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System.Security.Claims;
using System.Text.Json;


namespace SmartGriev.Controllers.AdminControllers
{
    [Authorize]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repo;
        private readonly IAuditRepository _auditRepo;

        public DepartmentController(IDepartmentRepository repo, IAuditRepository auditRepo)
        {
            _repo = repo;
            _auditRepo = auditRepo;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var data = await _repo.GetAllDepartments();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment(DepartmentDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var department = new Department
            {
                DepartmentName = dto.DepartmentName,
                IsActive = dto.IsActive
            };

            var result = await _repo.AddDepartment(department);
            
            Console.WriteLine("Audit Started ");
            //Audit Log
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string newDataJson = JsonSerializer.Serialize(new
            {
                result.DepartmentId,
                result.DepartmentName,
                result.IsActive
            });
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "CREATE",
                EntityName = "Department",
                EntityId = result.DepartmentId,
                OldData = null, // Empty because it didn't exist before
                NewData = newDataJson,
                Description = $"Created department {result.DepartmentName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            Console.WriteLine("Audit Saved after");

            return Ok(new
            {
                message = "Department added successfully",
                department = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var dept = await _repo.GetDepartmentById(id);

            if (dept == null)
                return NotFound("Department not found");

            // 1. Capture and serialize the state BEFORE modification
            string oldDataJson = JsonSerializer.Serialize(new
            {
                dept.DepartmentId,
                dept.DepartmentName,
                dept.IsActive
            });

            dept.DepartmentName = dto.DepartmentName;
            dept.IsActive = dto.IsActive;

            var updated = await _repo.UpdateDepartment(dept);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            // 2. Capture and serialize the state AFTER modification
            string newDataJson = JsonSerializer.Serialize(new
            {
                updated.DepartmentId,
                updated.DepartmentName,
                updated.IsActive
            });
            //Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "UPDATE",
                EntityName = "Department",
                EntityId = updated.DepartmentId,
                OldData = oldDataJson, // Contains old values
                NewData = newDataJson, // Contains updated values
                Description = $"Updated department {updated.DepartmentName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(new
            {
                message = "Department updated successfully",
                department = updated
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var dept = await _repo.GetDepartmentById(id);

            if (dept == null)
                return NotFound("Department not found");

            // Capture the state before it disappears completely
            string oldDataJson = JsonSerializer.Serialize(new
            {
                dept.DepartmentId,
                dept.DepartmentName,
                dept.IsActive
            });

            await _repo.DeleteDepartment(id);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "DELETE",
                EntityName = "Department",
                EntityId = dept.DepartmentId,
                OldData = oldDataJson, // Retain what we deleted
                NewData = null,
                Description = $"Deleted department {dept.DepartmentName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(new
            try
            {
                var result = await _repo.DeleteDepartment(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        message = "Department not found"
                    });
                }

                return Ok(new
                {
                    message = "Department deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var dept = await _repo.GetDepartmentById(id);
            if (dept == null)
                return NotFound("Department not found");

            // 1. Capture state before status swap
            string oldDataJson = JsonSerializer.Serialize(new
            {
                dept.DepartmentId,
                dept.DepartmentName,
                dept.IsActive
            });
            var updatedDept = await _repo.ToggleDepartmentStatus(id);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            string newDataJson = JsonSerializer.Serialize(new
            {
                updatedDept.DepartmentId,
                updatedDept.DepartmentName,
                updatedDept.IsActive
            });
            //Audit log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "STATUS_CHANGE",
                EntityName = "Department",
                EntityId = updatedDept.DepartmentId,
                OldData = oldDataJson,
                NewData = newDataJson,
                Description = $"Department status changed to {(updatedDept.IsActive ? "Active" : "Inactive")}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            if (updatedDept == null)
                return NotFound("Department not found");

            return Ok(new
            {
                message = "Status updated successfully",
                isActive = updatedDept.IsActive
            });
        }
        [HttpGet("dropdown")]
        public async Task<IActionResult> GetDepartmentDropdown()
        {
            var departments = await _repo.GetAllDepartments();

            var result = departments.Select(d => new
            {
                departmentId = d.DepartmentId,
                departmentName = d.DepartmentName
            });

            return Ok(result);
        }
    }
}
