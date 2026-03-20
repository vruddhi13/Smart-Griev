using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailOrMobile(string value);

        Task<bool> UserExists(string email, string mobile);

        Task<User> CreateUser(User user);
    }
}
