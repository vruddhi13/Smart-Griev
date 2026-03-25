using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.Repositories.Interfaces;
using SmartGriev.DTOs.AdminDTOs;

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
            if (user == null) return NotFound();

            user.IsActive = !user.IsActive;
            await _userRepository.UpdateUser(user);

            return Ok(user);
        }
    }
}
