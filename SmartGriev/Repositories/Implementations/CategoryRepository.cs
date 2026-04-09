using Microsoft.EntityFrameworkCore;
using SmartGriev.Models;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Repositories.Implementations
{
    public class CategoryRepository: ICategoryRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public CategoryRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task<List<ComplaintCategory>> GetAllCategories()
        {
            return await _context.ComplaintCategories
                .Where(c => c.IsActive == true)
                .ToListAsync();
        }

        public async Task<ComplaintCategory> AddCategory(CategoryCreateDTO dto)
        {
            var category = new ComplaintCategory
            {
                CategoryName = dto.CategoryName ?? "",
                DepartmentId = dto.DepartmentId,
                Description = dto.Description,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.ComplaintCategories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task UpdateCategory(int id, CategoryUpdateDTO dto)
        {
            var category = await _context.ComplaintCategories.FindAsync(id);

            if (category == null) return;

            category.CategoryName = dto.CategoryName ?? category.CategoryName;
            category.Description = dto.Description ?? category.Description ?? "";
            category.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteCategory(int id)
        {
            var category = await _context.ComplaintCategories.FindAsync(id);

            if (category == null) return;

            category.IsActive = false;

            await _context.SaveChangesAsync();
        }
    }
}
