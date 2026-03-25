using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
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
            Console.WriteLine(dto.CategoryName);
            Console.WriteLine(dto.DepartmentId);
            Console.WriteLine(dto.SlaHours);
            var result = await _categoryRepository.AddCategory(dto);
            return Ok(result);
            
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryUpdateDTO dto)
        {
            Console.WriteLine("Update Called");
            Console.WriteLine(dto.CategoryName);
            Console.WriteLine(dto.Description);
            Console.WriteLine(dto.SlaHours);

            await _categoryRepository.UpdateCategory(id, dto);
            return Ok(new
            {
                success = true,
                message = "Category updated successfully"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _categoryRepository.DeleteCategory(id);
            return Ok("Category Deleted");
        }


    }
}
