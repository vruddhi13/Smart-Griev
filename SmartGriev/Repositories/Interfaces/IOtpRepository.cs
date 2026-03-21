using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IOtpRepository
    {
        void SaveOtp(string mobile, string otp);

        bool VerifyOtp(string mobile, string otp);
    }
}
