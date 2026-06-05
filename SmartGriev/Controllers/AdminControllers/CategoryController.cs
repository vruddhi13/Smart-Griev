using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System.Text.Json;

namespace SmartGriev.Controllers.AdminControllers
{
    [Authorize]
    [Route("api/admin/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IAuditRepository _auditRepo;

        public CategoryController(ICategoryRepository categoryRepository, IAuditRepository auditRepo)
        {
            _categoryRepository = categoryRepository;
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
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepository.GetAllCategories();
            return Ok(categories);
            
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory(CategoryCreateDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            Console.WriteLine(dto.CategoryName);
            Console.WriteLine(dto.DepartmentId);
           
            var result = await _categoryRepository.AddCategory(dto);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string newDataJson = JsonSerializer.Serialize(new
            {
                result.CategoryId,
                result.CategoryName,
                result.Description,
                result.DepartmentId
            });
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "CREATE",
                EntityName = "Category",
                EntityId = result.CategoryId, // adjust if different
                OldData = null, // No historical data on creation
                NewData = newDataJson,
                Description = $"Created category {dto.CategoryName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            return Ok(result);
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryUpdateDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            Console.WriteLine("Update Called");
            Console.WriteLine(dto.CategoryName);
            Console.WriteLine(dto.Description);

            var existingCategory = await _categoryRepository.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound("Category not found");
            }

            string oldDataJson = JsonSerializer.Serialize(new
            {
                existingCategory.CategoryId,
                existingCategory.CategoryName,
                existingCategory.Description,
                existingCategory.DepartmentId
            });

            await _categoryRepository.UpdateCategory(id, dto);
            var updatedCategory = await _categoryRepository.GetCategoryById(id);
            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = updatedCategory!.CategoryId,
                Name = updatedCategory.CategoryName,
                Description = updatedCategory.Description,
                DepartmentId = updatedCategory.DepartmentId
            });

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "UPDATE",
                EntityName = "Category",
                EntityId = id,
                OldData = oldDataJson, // Shows left side in UI
                NewData = newDataJson, 
                Description = $"Updated category {dto.CategoryName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(new
            {
                success = true,
                message = "Category updated successfully"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var existingCategory = await _categoryRepository.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound("Category not found");
            }

            string oldDataJson = JsonSerializer.Serialize(new
            {
                existingCategory.CategoryId,
                existingCategory.CategoryName,
                existingCategory.Description,
                existingCategory.DepartmentId
            });
            await _categoryRepository.DeleteCategory(id);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "DELETE",
                EntityName = "Category",
                EntityId = id,
                OldData = oldDataJson, // Record what used to exist here
                NewData = null,
                Description = $"Deleted category with ID {id}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            return Ok("Category Deleted");
        }

            try
            {
                await _categoryRepository.DeleteCategory(id);

                return Ok(new
                {
                    message = "Category deleted successfully"
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
    }
}
