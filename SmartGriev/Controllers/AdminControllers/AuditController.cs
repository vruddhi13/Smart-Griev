using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Controllers.AdminControllers
{
    [Route("api/admin/audit")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        private readonly IAuditRepository _auditRepo;

        public AuditController(IAuditRepository auditRepo)
        {
            _auditRepo = auditRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _auditRepo.GetLogs();
            return Ok(logs);
        }
    }
}
