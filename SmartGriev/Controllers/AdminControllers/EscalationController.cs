using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/escalation")]
    [ApiController]
    public class EscalationController : ControllerBase
    {
        private readonly IEscalationRepository _repository;

        private readonly Ict2smartGrievDbContext _context;

        public EscalationController(IEscalationRepository repository, Ict2smartGrievDbContext context)
        {
            _repository = repository;
            _context = context;
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

        [HttpGet("complaints")]
        public async Task<IActionResult> GetEscalationComplaints()
        {
            var data =
                await _repository
                    .GetEscalationComplaints();

            return Ok(data);
        }

        [HttpGet("officers/{departmentId}")]
        public async Task<IActionResult> GetOfficersByDepartment(int departmentId)
        {
            try
            {
                var officers = await _context.Users
                    .Include(x => x.Role)
                    .Where(x =>
                        x.DepartmentId == departmentId &&
                        x.IsActive == true &&
                        x.Role != null &&
x.Role.RoleName.ToLower() == "officer")
                 .Select(x => new {
                     userId = x.UserId,
                     userName = x.FullName,
                     email = x.Email,
                     mobileNo = x.MobileNo,
                     departmentName = x.Department.DepartmentName,
                     role = x.Role.RoleName
                 })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = officers
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