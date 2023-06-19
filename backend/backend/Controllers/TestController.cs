using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        [HttpGet(Name = "test")]
        [Produces("application/json")]
        public string Test()
        {
            return "OK";
        }
    }
}
