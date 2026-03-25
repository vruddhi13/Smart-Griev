using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<ComplaintCategory>> GetAllCategories();
        Task<ComplaintCategory> AddCategory(CategoryCreateDTO dto);
        Task UpdateCategory(int id, CategoryUpdateDTO dto);
        Task DeleteCategory(int id);
    }
}
