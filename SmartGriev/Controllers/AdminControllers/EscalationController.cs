using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/escalation")]
    [ApiController]
    public class EscalationController : ControllerBase
    {
        private readonly IEscalationRepository _repository;

        public EscalationController(IEscalationRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _repository.GetAllEscalations();

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // GET ESCALATION BY COMPLAINT ID
        [HttpGet("{complaintId}")]
        public async Task<IActionResult> GetByComplaint(int complaintId)
        {
            try
            {
                var result =
                    await _repository.GetEscalationByComplaint(complaintId);

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // MANUAL ESCALATION
        [HttpPost("manual")]
        public async Task<IActionResult> ManualEscalate(
            [FromBody] EscalationDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result =
                    await _repository.ManualEscalate(dto);

                return Ok(new
                {
                    success = true,
                    message = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // AUTO ESCALATION
        [HttpPost("run-auto-escalation")]
        public async Task<IActionResult> AutoEscalate()
        {
            try
            {
                var result =
                    await _repository.AutoEscalateComplaints();

                return Ok(new
                {
                    success = true,
                    message = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}