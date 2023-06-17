using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {

        [HttpGet(Name = "GetProperties")]
        [Produces("application/json")]
        public List<MostRecentPrice> GetProperties()
        {
            return backend.Services.PropertyService.MostRecentPrices();
        }
    }
}
