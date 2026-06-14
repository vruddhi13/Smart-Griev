using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using System.Text.Json;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/sla")]
    [ApiController]
    public class SLAController : ControllerBase
    {
        private readonly ISlaRepository _slaRepository;
        private readonly IAuditRepository _auditRepo;

        public SLAController(ISlaRepository slaRepository, IAuditRepository auditRepo)
        {
            _slaRepository = slaRepository;
            _auditRepo = auditRepo;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst("UserId");

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetSla()
        {
            var sla = await _slaRepository.GetAllSla();
            return Ok(sla);
        }

        [HttpPost]
        public async Task<IActionResult> AddSla(SlaCreateDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var result = await _slaRepository.AddSla(dto);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            // 1. Snapshot values mapped to your explicit SLA_master schema properties
            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = result.SlaId, // Mapped from [sla_id]
                DepartmentId = result.DepartmentId,
                CategoryId = result.CategoryId,
                PriorityLevel = result.PriorityLevel,
                ResolutionHours = result.ResolutionHours,
                EscalationHours = result.EscalationHours,
                IsActive = result.IsActive
            });
            // Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "CREATE",
                EntityName = "SLA",
                EntityId = result.SlaId,
                OldData = null,
                NewData = newDataJson,
                Description = $"Created SLA Configuration with ID {result.SlaId} for Category {result.CategoryId}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSla(int id, SlaUpdateDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var existingSla = await _slaRepository.GetSlaById(id);
            if (existingSla == null)
            {
                return NotFound("SLA record not found");
            }

            string oldDataJson = JsonSerializer.Serialize(new
            {
                Id = existingSla.SlaId,
                DepartmentId = existingSla.DepartmentId,
                CategoryId = existingSla.CategoryId,
                PriorityLevel = existingSla.PriorityLevel,
                ResolutionHours = existingSla.ResolutionHours,
                EscalationHours = existingSla.EscalationHours,
                IsActive = existingSla.IsActive
            });

            await _slaRepository.UpdateSla(id, dto);
            // 3. Obtain post-execution record snapshot state from store
            var updatedSla = await _slaRepository.GetSlaById(id);

            string newDataJson = JsonSerializer.Serialize(new
            {
                Id = id,
                DepartmentId = updatedSla?.DepartmentId ?? existingSla.DepartmentId,
                CategoryId = updatedSla?.CategoryId ?? existingSla.CategoryId,
                PriorityLevel = updatedSla?.PriorityLevel ?? existingSla.PriorityLevel,
                ResolutionHours = updatedSla?.ResolutionHours ?? existingSla.ResolutionHours,
                EscalationHours = updatedSla?.EscalationHours ?? existingSla.EscalationHours,
                IsActive = updatedSla?.IsActive ?? existingSla.IsActive
            });

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            // Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "UPDATE",
                EntityName = "SLA",
                EntityId = id,
                OldData = oldDataJson,
                NewData = newDataJson,
                Description = $"Updated SLA Configuration with ID {id}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            return Ok(new
            {
                success = true,
                message = "SLA updated successfully"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSla(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }

            var existingSla = await _slaRepository.GetSlaById(id);
            if (existingSla == null)
            {
                return NotFound("SLA record not found");
            }

            string oldDataJson = JsonSerializer.Serialize(new
            {
                Id = existingSla.SlaId,
                DepartmentId = existingSla.DepartmentId,
                CategoryId = existingSla.CategoryId,
                PriorityLevel = existingSla.PriorityLevel,
                ResolutionHours = existingSla.ResolutionHours,
                EscalationHours = existingSla.EscalationHours,
                IsActive = existingSla.IsActive
            });

            await _slaRepository.DeleteSla(id);

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            // Audit Log
            await _auditRepo.AddLog(new AuditLog
            {
                UserId = userId.Value,
                ActionType = "DELETE",
                EntityName = "SLA",
                EntityId = id,
                OldData = oldDataJson,
                NewData = null,
                Description = $"Deleted SLA configuration record with ID {id}",
                IpAddress = ipAddress,
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            
            try
            {
                await _slaRepository.DeleteSla(id);

                return Ok(new
                {
                    message = "SLA deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
