using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs;
using SmartGriev.Models;

namespace SmartGriev.Controllers.Identity
{
    [Route("api/Identity/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        //[HttpPost("login")]
        //public IActionResult Login(LoginRequest model)
        //{
        //    return Ok("Login API Working");
        //}
        private readonly Ict2smartGrievDbContext _context;

        public AccountController(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        // -----------------------------
        // REGISTER USER
        // -----------------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(x => x.Email == model.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            // Check if mobile already exists
            if (await _context.Users.AnyAsync(x => x.MobileNo == model.MobileNo))
            {
                return BadRequest(new { message = "Mobile number already registered" });
            }

            int roleId = 4; // Citizen default

            if (model.Email.EndsWith("_admin@smartgriev.com"))
                roleId = 1;
            else if (model.Email.EndsWith("_dept@smartgriev.com"))
                roleId = 2;
            else if (model.Email.EndsWith("_officer@smartgriev.com"))
                roleId = 3;

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                MobileNo = model.MobileNo,
                PasswordHash = model.Password,   // later we will hash it
                RoleId = roleId,
                DepartmentId = null,
                IsActive = true,
                IsDeleted = false,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        // -----------------------------
        // LOGIN USER
        // -----------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            if (string.IsNullOrEmpty(model.EmailOrMobile) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Email/Mobile and password required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(x =>
                (x.Email == model.EmailOrMobile || x.MobileNo == model.EmailOrMobile) &&
                x.PasswordHash == model.Password &&
                x.IsActive == true &&
                x.IsDeleted == false
            );

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            return Ok(new
            {
                message = "Login successful",
                userId = user.UserId,
                name = user.FullName,
                roleId = user.RoleId
            });
        }
    }
}
