using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetItems()
        {
            var items = new[] { new { Id = 1, Name = "Item A" }, new { Id = 2, Name = "Item B" } };

            return Ok(items);
        }
    }
}
