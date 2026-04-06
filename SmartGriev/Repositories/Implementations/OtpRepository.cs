using Microsoft.EntityFrameworkCore;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using static System.Net.WebRequestMethods;
namespace SmartGriev.Repositories.Implementations
{
    public class OtpRepository : IOtpRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public OtpRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task SaveOtpAsync(string mobile, string otp)
        {
            var newOtp = new OtpVerification
            {
                MobileNo = mobile,
                OtpCode = otp,
                AttemptCount = 0,
                CreatedAt = DateTime.Now,
                ExpiryTime = DateTime.Now.AddMinutes(5),
                IsVerified = false
            };

            await _context.OtpVerifications.AddAsync(newOtp);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> VerifyOtpAsync(string mobile, string otp)
        {
            var record = await _context.OtpVerifications
                .Where(x => x.MobileNo == mobile && x.IsVerified == false)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (record == null)
                return false;

            if (record.ExpiryTime < DateTime.Now)
                return false;

            if (record.AttemptCount >= 3)
                return false;

            if (record.OtpCode == otp)
            {
                record.IsVerified = true;
                record.VerifiedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return true;
            }

            record.AttemptCount += 1;
            await _context.SaveChangesAsync();

            return false;
        }
    }
}
