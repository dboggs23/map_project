using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        [HttpGet(Name = "Test")]
        [Produces("application/json")]
        public string Test()
        {
            return "OK";
        }
    }
}
