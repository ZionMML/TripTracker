using API.DTOs;
using Api.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotoController(IPhotoService photoService) : ControllerBase
{
    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var username = User.GetUserName();

        return null;
    }
}
