using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/users")]
    [ApiController]
    public class UserAndRoleController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserAndRoleController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsActive = !user.IsActive;
            await _userRepository.UpdateUser(user);

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRoleListDTO dto)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            // ✅ Basic fields
            user.FullName = dto.Name;
            user.Email = dto.Email;
            user.MobileNo = dto.Phone;

            // ✅ ROLE FIX (MAIN PART)
            user.RoleId = dto.RoleId;

            // ✅ OPTIONAL: auto-role from email (if needed)
            if (!string.IsNullOrEmpty(dto.Email))
            {
                if (dto.Email.EndsWith("_dept@smartgriev.com"))
                    user.RoleId = 2;

                else if (dto.Email.EndsWith("_officer@smartgriev.com"))
                    user.RoleId = 3;
            }
            Console.WriteLine("RoleId from frontend: " + dto.RoleId);

            await _userRepository.UpdateUser(user);

            return Ok(new { message = "User updated successfully" });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            await _userRepository.DeleteUser(user);

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserRoleListDTO dto)
        {
            var user = new User
            {
                FullName = dto.Name,
                Email = dto.Email,
                MobileNo = dto.Phone,
                RoleId = dto.RoleId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            await _userRepository.AddUser(user);

            return Ok(new { message = "User added successfully" });
        }
    }
}
