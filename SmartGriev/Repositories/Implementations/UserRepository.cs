using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SmartGriev.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public UserRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailOrMobile(string value)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x =>
                x.Email == value || x.MobileNo == value);
        }

        public async Task<bool> UserExists(string email, string mobile)
        {
            return await _context.Users
                .AnyAsync(x => x.Email == email || x.MobileNo == mobile);
        }

        public async Task<User> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<object> GetAdminStatsAsync()
        {
            return new
            {
                totalComplaints = await _context.Complaints.CountAsync(),
                activeOfficers = await _context.Users.CountAsync(u => u.RoleId == 2 || u.RoleId == 3),
                slaBreaches = 5 // Hardcoded placeholder
            };
        }

        public async Task<List<object>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => !u.IsDeleted)
                .Select(u => new
                {
                    userId = u.UserId,      
                    name = u.FullName,     
                    email = u.Email,        
                    phone = u.MobileNo,     
                    roleName = u.Role.RoleName,
                    roleId = u.RoleId,      
                    isActive = u.IsActive
                })
                .ToListAsync<object>();
        }

        public async Task<User> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }
        public async Task UpdateUser(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}
