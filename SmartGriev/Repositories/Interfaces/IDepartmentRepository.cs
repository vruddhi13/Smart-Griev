using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<List<Department>> GetAllDepartments();
        Task<Department> AddDepartment(Department dept);
        Task<Department> UpdateDepartment(Department dept);
        Task<bool> DeleteDepartment(int id);
        Task<Department?> GetDepartmentById(int id);
    }
}
