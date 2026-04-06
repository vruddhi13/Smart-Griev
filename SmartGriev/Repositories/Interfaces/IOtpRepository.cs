using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IOtpRepository
    {
        Task SaveOtpAsync(string mobile, string otp);
        Task<bool> VerifyOtpAsync(string mobile, string otp);
    }
}
