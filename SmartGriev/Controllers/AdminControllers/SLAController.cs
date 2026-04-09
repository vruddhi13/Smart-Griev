using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/sla")]
    [ApiController]
    public class SLAController : ControllerBase
    {
        private readonly ISlaRepository _slaRepository;

        public SLAController(ISlaRepository slaRepository)
        {
            _slaRepository = slaRepository;
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
            var result = await _slaRepository.AddSla(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSla(int id, SlaUpdateDTO dto)
        {
            await _slaRepository.UpdateSla(id, dto);

            return Ok(new
            {
                success = true,
                message = "SLA updated successfully"
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSla(int id)
        {
            await _slaRepository.DeleteSla(id);
            return Ok("SLA Deleted");
        }
    }
}
