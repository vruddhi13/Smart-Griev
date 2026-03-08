using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace SmartGriev.Controllers.Identity
{
    [Route("api/Identity/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login(LoginRequest model)
        {
            return Ok("Login API Working");
        }
    }
}
