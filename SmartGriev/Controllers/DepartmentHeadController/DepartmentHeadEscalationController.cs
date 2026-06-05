using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs.Department;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.DepartmentHeadController
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentHeadEscalationController : ControllerBase
    {
        private readonly
            IDepartmentHeadEscalationRepository
            _repository;

        public DepartmentHeadEscalationController(
            IDepartmentHeadEscalationRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("my-escalations/{departmentHeadId}")]
        public async Task<IActionResult>
            GetMyEscalations(int departmentHeadId)
        {
            var result =
                await _repository
                    .GetMyEscalations(
                        departmentHeadId);

            return Ok(result);
        }

        [HttpPost("action/{departmentHeadId}")]
        public async Task<IActionResult>
            EscalationAction(
                int departmentHeadId,
                EscalationActionDTO dto)
        {
            var result =
                await _repository
                    .EscalationAction(
                        departmentHeadId,
                        dto);

            return Ok(new
            {
                success = result,
                message = "Action completed successfully"
            });
        }
    }
}
