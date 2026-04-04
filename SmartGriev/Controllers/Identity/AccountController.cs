using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Invalid request",
                    Data = null
                });

            var user = await _userRepository
                .GetUserByEmailOrMobile(model.EmailOrMobile);
            if (user == null)
            return Unauthorized(new ApiResponse<object>
            {
                Status = false,
                StatusCode = 401,
                Message = "User not found",
                Data = null
            });

            if (user.PasswordHash != model.Password)
                return Unauthorized(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 401,
                    Message = "Invalid password",
                    Data = null
                });

            if (string.IsNullOrEmpty(user.MobileNo))
                return BadRequest(new ApiResponse<object> {
                    Status = false,
                    StatusCode = 400,
                    Message = "Mobile number missing for user",
                    Data = null
                 });

            string otp = new Random().Next(100000, 999999).ToString();

            Console.WriteLine("=================================");
            Console.WriteLine($"OTP Generated: {otp}");
            Console.WriteLine($"Mobile: {user.MobileNo}");
            Console.WriteLine("=================================");

            _otpRepository.SaveOtp(user.MobileNo, otp);

            return Ok(new ApiResponse<object>
            {
                Status = true,
                StatusCode = 200,
                Message = "OTP sent successfully",
                //Data = new
                //{
                //    //otp = otp, // remove in production
                //    //mobile_no = user.MobileNo
                //}
            });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_1234567890")
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: "SmartGriev",
                audience: "SmartGrievUsers",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // VERIFY OTP
        [HttpPost("verify-otp")]
        public async Task<ActionResult<ApiResponse<object>>> VerifyOtp(ForgotPasswordDTO model)
        {
            if (string.IsNullOrEmpty(model.MobileNo) ||
                string.IsNullOrEmpty(model.Otp) ||
                string.IsNullOrEmpty(model.Purpose))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Mobile, OTP and Purpose required",
                    Data = null
                });
            }

            var valid = _otpRepository.VerifyOtp(model.MobileNo, model.Otp);

            if (!valid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Invalid OTP",
                    Data = null
                });
            }

            var user = await _userRepository.GetUserByEmailOrMobile(model.MobileNo);

            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 401,
                    Message = "User not found",
                    Data = null
                });
            }

            if (model.Purpose.ToLower() == "login")
            {
                var token = GenerateJwtToken(user);

                return Ok(new ApiResponse<object>
                {
                    Status = true,
                    StatusCode = 200,
                    Message = "Login successful",
                    Data = new
                    {
                        token = token,
                        userId = user.UserId,
                        roleId = user.RoleId
                    }
                });
            }

            // forgot password case
            return Ok(new ApiResponse<object>
            {
                Status = true,
                StatusCode = 200,
                Message = "OTP verified for password reset",
                Data = null
            });
        }

        // ===============================
        // REGISTER API
        // ===============================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            if (model == null)
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Invalid request",
                    Data = null
                });
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
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Department Head and Officer accounts can only be created by Admin.",
                    Data = null
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

            return Ok(new ApiResponse<object>
            {
                Status = true,
                StatusCode = 200,
                Message = "User registered successfully",
                Data = new
                {
                    role = roleId == 1 ? "Admin" : "Citizen"
                }
            });
        }

        [HttpGet("admin-stats")]
        public async Task<IActionResult> GetAdminStats()
        {
            // Uses the repository instead of direct _context
            var stats = await _userRepository.GetAdminStatsAsync();
            return Ok(stats);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<object>>> ForgotPassword(ForgotPasswordDTO model)
        {
            if (string.IsNullOrEmpty(model.MobileNo))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Mobile number required",
                    Data = null
                });
            }

            var user = await _userRepository.GetUserByEmailOrMobile(model.MobileNo);

            if (user == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "User not found",
                    Data = null
                });
            }

            string otp = new Random().Next(100000, 999999).ToString();

            _otpRepository.SaveOtp(model.MobileNo, otp);

            return Ok(new ApiResponse<object>
            {
                Status = true,
                StatusCode = 200,
                Message = "OTP sent successfully",
                Data = new { otp = otp } // remove later
            });
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<object>>> ResetPassword(ForgotPasswordDTO model)
        {
            if (string.IsNullOrEmpty(model.MobileNo) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 400,
                    Message = "Mobile and new password required",
                    Data = null
                });
            }

            var user = await _userRepository.GetUserByEmailOrMobile(model.MobileNo);

            if (user == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Status = false,
                    StatusCode = 404,
                    Message = "User not found",
                    Data = null
                });
            }

            // 🔐 Hash password (VERY IMPORTANT)
            user.PasswordHash = model.NewPassword;

            await _userRepository.UpdateUser(user);

            return Ok(new ApiResponse<object>
            {
                Status = true,
                StatusCode = 200,
                Message = "Password reset successfully",
                Data = null
            });
        }
    }
}