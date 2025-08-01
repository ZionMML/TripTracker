using Api.Data;
using Api.DTOs;
using API.DTOs;
using Api.Extensions;
using Api.Interfaces;
using API.Interfaces;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(
        IUserRepository userRepository,
        UserManager<ApplicationUser> userManager,
        IMapper _mapper,
        IPhotoService photoService
    ) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        [Authorize(Roles = "Admin")]
        [HttpGet] // GET: api/users
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                userDtos.Add(await MapUserWithRoles(user));
            }

            return Ok(userDtos);
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("{username}")] // GET: api/users/{username}
        public async Task<ActionResult<ApplicationUser>> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("Could not find user");

            var userDto = await MapUserWithRoles(user);

            return Ok(userDto);
        }

        private async Task<UserDto> MapUserWithRoles(ApplicationUser user)
        {
            var userDto = _mapper.Map<UserDto>(user);
            var roles = await _userManager.GetRolesAsync(user);
            userDto.Role = roles.FirstOrDefault() ?? "User";
            return userDto;
        }

        [Authorize(Roles = "Admin,User")]
        [HttpPut("{username}")] //PUT: api/users/{username}
        public async Task<ActionResult> UpdateUser(string username, UpdateUserDto updateUserDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("Could not find user");

            _mapper.Map(updateUserDto, user);
            _userRepository.Update(user);

            if (!await _userRepository.SaveAllAsync())
                return BadRequest("Failed to update user");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{username}")] //DELETE: api/users/{username}
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("Could not find user");

            _userRepository.Delete(user);

            if (!await _userRepository.SaveAllAsync())
                return BadRequest("Failed to delete user");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            if (await _userManager.FindByNameAsync(createUserDto.Username) is not null)
                return BadRequest("Username is already taken.");

            var user = _mapper.Map<ApplicationUser>(createUserDto);

            // Create user with hased password
            var result = await _userManager.CreateAsync(user, createUserDto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            var userDto = _mapper.Map<UserDto>(user);

            return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, userDto);
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(
            [FromForm] string username,
            [FromForm] bool isProfilePhoto,
            [FromForm] IFormFile file
        )
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("Cannot update user");

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null)
                return BadRequest(result.Error.Message);

            if (isProfilePhoto)
            {
                var photo = new ProfilePhoto
                {
                    Url = result.SecureUrl.AbsoluteUri,
                    PublicId = result.PublicId,
                };

                user.ProfilePhoto = photo;
                await _userRepository.SaveAllAsync();

                return CreatedAtAction(
                    nameof(GetUser),
                    new { username = user.UserName },
                    _mapper.Map<PhotoDto>(photo)
                );
            }
            else
            {
                return BadRequest("Problem adding photo");
            }
        }

        [HttpDelete("delete-photo")]
        public async Task<ActionResult<PhotoDto>> DeletePhoto(
            [FromQuery] int photoId,
            [FromQuery] string username
        )
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("User not found");

            var photo = user.ProfilePhoto;

            if (photo == null || photo.Id != photoId)
                return BadRequest("This photo cannot be deleted");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                    return BadRequest(result.Error.Message);
            }

            _userRepository.DeleteProfilePhoto(photo);
            user.ProfilePhoto = null;
            await _userRepository.SaveAllAsync();

            return Ok();
        }
    }
}
