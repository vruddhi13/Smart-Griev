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

        public void SaveOtp(string mobile, string otp)
        {
            var oldOtps = _context.OtpVerifications
                .Where(x => x.MobileNo == mobile && x.IsVerified == false);

            _context.OtpVerifications.RemoveRange(oldOtps);

            var newOtp = new OtpVerification
            {
                MobileNo = mobile,
                OtpCode = otp,
                AttemptCount = 0,
                CreatedAt = DateTime.Now,
                ExpiryTime = DateTime.Now.AddMinutes(5),
                IsVerified = false
            };

            _context.OtpVerifications.Add(newOtp);
            _context.SaveChanges();
        }

        public bool VerifyOtp(string mobile, string otp)
        {
            var record = _context.OtpVerifications
                .Where(x => x.MobileNo == mobile && x.IsVerified == false)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefault();

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

                _context.SaveChanges();
                return true;
            }

            record.AttemptCount += 1;

            _context.SaveChanges();
            return false;
        }
    }
}
