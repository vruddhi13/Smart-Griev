using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.DTOs.OfficerDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartGriev.Controllers.AdminControllers
{
    [Authorize]
    [Route("api/admin/users")]
    [ApiController]
    public class UserAndRoleController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuditRepository _auditRepo;
        private readonly Ict2smartGrievDbContext _context;

        // Unified constructor combining all injected dependencies
        public UserAndRoleController(IUserRepository userRepository, IAuditRepository auditRepo, Ict2smartGrievDbContext context)
        {
            _userRepository = userRepository;
            _auditRepo = auditRepo;
            _context = context;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        } // <-- Fixed: Added missing closing brace here

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPut("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            string oldDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            // Perform mutation swap
            user.IsActive = !user.IsActive;
            await _userRepository.UpdateUser(user);

            // 2. Capture snapshot AFTER toggle execution
            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            // audit log
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "STATUS_CHANGE",
                EntityName = "User",
                EntityId = user.UserId,
                OldData = oldDataJson,
                NewData = newDataJson,
                Description = $"User status changed to {(user.IsActive ? "Active" : "Inactive")}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(user);
        }

        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRoleListDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var user = await _userRepository.GetUserById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            string oldDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            // ✅ Basic fields
            user.FullName = dto.Name ?? "";
            user.Email = dto.Email;
            user.MobileNo = dto.Phone ?? "";

            // ✅ ROLE FIX (MAIN PART)
            user.FullName = dto.Name;
            user.Email = dto.Email;
            user.MobileNo = dto.Phone;
            user.RoleId = dto.RoleId;

            if (dto.RoleId == 2 || dto.RoleId == 3)
                user.DepartmentId = dto.DepartmentId;
            else
                user.DepartmentId = null;

            await _userRepository.UpdateUser(user);

            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            // Audit log 
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "UPDATE",
                EntityName = "User",
                EntityId = user.UserId,
                OldData = oldDataJson,
                NewData = newDataJson,
                Description = $"Updated user {user.FullName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "User not found"
                });
            }

            string oldDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            try
            {
                await _userRepository.DeleteUser(user);

                // audit log
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                await _auditRepo.AddLog(new AuditLog
                {
                    UserId = userId.Value,
                    ActionType = "DELETE",
                    EntityName = "User",
                    EntityId = user.UserId,
                    OldData = oldDataJson,
                    NewData = null,
                    Description = $"Deleted user {user.FullName}",
                    IpAddress = ipAddress,
                    UserAgent = Request.Headers["User-Agent"].ToString()
                });

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

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserRoleListDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var user = new User
            {
                FullName = dto.Name ?? "",
                Email = dto.Email,
                MobileNo = dto.Phone ?? "",
                RoleId = dto.RoleId,
                DepartmentId = dto.DepartmentId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            await _userRepository.AddUser(user);
            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = user.UserId,
                Name = user.FullName,
                user.Email,
                Phone = user.MobileNo,
                user.RoleId,
                user.IsActive
            });

            // audit log
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "CREATE",
                EntityName = "User",
                EntityId = user.UserId,
                OldData = null,
                NewData = newDataJson,
                Description = $"Created user {user.FullName}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });

            return Ok(new { message = "User added successfully" });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email,
                mobileNo = user.MobileNo,
                roleId = user.RoleId,
                isActive = user.IsActive
            });
        }

        [HttpPost("update-account")]
        public async Task<IActionResult> UpdateAdminPassword([FromBody] UpdateAccountDTO dto)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");

                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                int userId = int.Parse(userIdClaim.Value);

                var user = await _userRepository.GetUserById(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (string.IsNullOrWhiteSpace(dto.Password))
                {
                    return BadRequest(new { message = "Password is required" });
                }

                string oldDataJson = JsonSerializer.Serialize(new { Id = user.UserId, Note = "Password Modification Event Initiated." });

                var passwordHasher = new PasswordHasher<User>();
                user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);
                user.UpdatedAt = DateTime.Now;

                await _userRepository.UpdateUser(user);

                string newDataJson = JsonSerializer.Serialize(new { Id = user.UserId, Note = "Password successfully hashed and saved." });
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                await _auditRepo.AddLog(new AuditLog
                {
                    UserId = userId,
                    ActionType = "PASSWORD_CHANGE",
                    EntityName = "User",
                    EntityId = user.UserId,
                    OldData = oldDataJson,
                    NewData = newDataJson,
                    Description = $"Password updated securely for administrative account profile {user.FullName}.",
                    IpAddress = ipAddress,
                    UserAgent = Request.Headers["User-Agent"].ToString()
                });

                return Ok(new
                {
                    message = "Password updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message
                });
            }
        }
    }
}