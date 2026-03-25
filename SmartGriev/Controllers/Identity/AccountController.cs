using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.Identity
{
    [Route("api/identity/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IOtpRepository _otpRepository;

        public AccountController(
            IUserRepository userRepository,
            IOtpRepository otpRepository)
        {
            _userRepository = userRepository;
            _otpRepository = otpRepository;
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.EmailOrMobile) || string.IsNullOrEmpty(model.Password))
                return BadRequest(new { message = "Invalid request" });

            var user = await _userRepository
                .GetUserByEmailOrMobile(model.EmailOrMobile);
            if (user == null)
                return Unauthorized(new { message = "User not found" });

            if (user.PasswordHash != model.Password)
                return Unauthorized(new { message = "Invalid password" });

            if (string.IsNullOrEmpty(user.MobileNo))
                return BadRequest(new { message = "Mobile number missing for user" });

            string otp = new Random().Next(100000, 999999).ToString();

            Console.WriteLine("OTP Generated: " + otp);

            _otpRepository.SaveOtp(user.MobileNo, otp);

            return Ok(new
            {
                message = "OTP sent successfully",
                mobile = user.MobileNo
            });
        }

        // VERIFY OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDTO model)
        {
            if (model == null)
                return BadRequest(new { message = "Invalid request" });

            var valid = _otpRepository.VerifyOtp(model.MobileNo, model.Otp);

            if (!valid)
                return BadRequest(new { message = "Invalid OTP or maximum attempts reached" });

            var user = await _userRepository
                .GetUserByEmailOrMobile(model.MobileNo);

            if (user == null)
                return Unauthorized(new { message = "User not found" });

            return Ok(new
            {
                message = "Login successful",
                userId = user.UserId,
                roleId = user.RoleId,   // 🔥 IMPORTANT for role-based redirect
                name = user.FullName
            });
        }

        // ===============================
        // REGISTER API
        // ===============================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (model == null)
                return BadRequest(new { message = "Invalid request" });

            int roleId = 4; // Default = Citizen

            if (!string.IsNullOrEmpty(model.Email) &&
              model.Email.EndsWith("_admin@smartgriev.com"))
            {
                roleId = 1;
            }
            else if (!string.IsNullOrEmpty(model.Email) &&
                      (model.Email.EndsWith("_dept@smartgriev.com") ||
                       model.Email.EndsWith("_officer@smartgriev.com")))
            {
                return BadRequest(new
                {
                    message = "Department Head and Officer accounts can only be created by Admin."
                });
            }

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                MobileNo = model.MobileNo,
                PasswordHash = model.Password,
                RoleId = roleId
            };

            await _userRepository.CreateUser(user);

            return Ok(new
            {
                message = "User registered successfully",
                roleId = roleId,
                role = roleId == 1 ? "Admin" : "Citizen"
            });
        }

        [HttpGet("admin-stats")]
        public async Task<IActionResult> GetAdminStats()
        {
            // Uses the repository instead of direct _context
            var stats = await _userRepository.GetAdminStatsAsync();
            return Ok(stats);
        }
    }
}