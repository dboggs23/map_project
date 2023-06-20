using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {

        [HttpGet(Name = "allProperties")]
        [Produces("application/json")]
        public List<MostRecentPrice> GetProperties()
        {
            return backend.Services.PropertyService.MostRecentPrices();
        }

        [HttpGet(Name = "propertiesByYear")]
        [Produces("application/json")]
        public List<PropertiesGroupedByYear> PropertiesByYear()
        {
            return backend.Services.PropertyService.PropertiesByYearMethod();
        }
    }
}
