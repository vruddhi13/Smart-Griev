using Microsoft.EntityFrameworkCore;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Repositories.Implementations
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public DepartmentRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task<List<Department>> GetAllDepartments()
        {
            return await _context.Departments
                .OrderByDescending(x => x.DepartmentId)
                .ToListAsync();
        }

        public async Task<Department> AddDepartment(Department dept)
        {
            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();
            return dept;
        }

        public async Task<Department?> GetDepartmentById(int id)
        {
            return await _context.Departments.FindAsync(id);
        }

        public async Task<Department> UpdateDepartment(Department dept)
        {
            _context.Departments.Update(dept);
            await _context.SaveChangesAsync();
            return dept;
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            var dept = await _context.Departments.FindAsync(id);

            if (dept == null)
                return false;

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Department> ToggleDepartmentStatus(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept != null)
            {
                dept.IsActive = !dept.IsActive; // Flip the status
                await _context.SaveChangesAsync();
            }
            return dept;
        }
    }
}
