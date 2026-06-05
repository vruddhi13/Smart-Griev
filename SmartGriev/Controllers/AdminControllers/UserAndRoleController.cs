using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin")] 
    [ApiController]
    public class UserAndRoleController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly Ict2smartGrievDbContext _context;

        public UserAndRoleController(IUserRepository userRepository, Ict2smartGrievDbContext context)
        {
            _userRepository = userRepository;
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRoleListDTO dto)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.FullName = dto.Name;
            user.Email = dto.Email;
            user.MobileNo = dto.Phone;
            user.RoleId = dto.RoleId;

            if (dto.RoleId == 2 || dto.RoleId == 3)
                user.DepartmentId = dto.DepartmentId;
            else
                user.DepartmentId = null;

            await _userRepository.UpdateUser(user);
            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "User not found"
                });
            }

            try
            {
                await _userRepository.DeleteUser(user);

                return Ok(new
                {
                    success = true,
                    message = "User deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpPost("users")]
        public async Task<IActionResult> AddUser([FromBody] UserRoleListDTO dto)
        {
            var user = new User
            {
                FullName = dto.Name,
                Email = dto.Email,
                MobileNo = dto.Phone,
                RoleId = dto.RoleId,
                DepartmentId = dto.DepartmentId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            await _userRepository.AddUser(user);
            return Ok(new { message = "User added successfully" });
        }

        [HttpPut("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsActive = !user.IsActive;
            await _userRepository.UpdateUser(user);

            return Ok(user);
        }
    }
}