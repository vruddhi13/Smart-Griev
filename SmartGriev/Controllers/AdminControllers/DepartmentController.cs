using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs.Department;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;


namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repo;

        public DepartmentController(IDepartmentRepository repo)
        {
            _repo = repo;
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
            var department = new Department
            {
                DepartmentName = dto.DepartmentName,
                IsActive = dto.IsActive
            };

            var result = await _repo.AddDepartment(department);

            return Ok(new
            {
                message = "Department added successfully",
                department = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentDTO dto)
        {
            var dept = await _repo.GetDepartmentById(id);

            if (dept == null)
                return NotFound("Department not found");

            dept.DepartmentName = dto.DepartmentName;
            dept.IsActive = dto.IsActive;

            var updated = await _repo.UpdateDepartment(dept);

            return Ok(new
            {
                message = "Department updated successfully",
                department = updated
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var result = await _repo.DeleteDepartment(id);

            if (!result)
                return NotFound("Department not found");

            return Ok(new
            {
                message = "Department deleted successfully"
            });
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var updatedDept = await _repo.ToggleDepartmentStatus(id);

            if (updatedDept == null)
                return NotFound("Department not found");

            return Ok(new
            {
                message = "Status updated successfully",
                isActive = updatedDept.IsActive
            });
        }
    }
}
