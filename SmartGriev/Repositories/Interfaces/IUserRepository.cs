using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailOrMobile(string value);

        Task<bool> UserExists(string email, string mobile);

        Task<User> CreateUser(User user);

        Task<object> GetAdminStatsAsync();
        Task<List<object>> GetAllUsersAsync();
        Task<User> GetUserById(int id);
        Task UpdateUser(User user);
        Task DeleteUser(User user);

        Task AddUser(User user);
    }
}
