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
    }
}
