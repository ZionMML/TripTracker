using Api.DTOs;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Api.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(UserManager<ApplicationUser> userManager, IMapper _mapper)
        : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        //[Authorize(Roles = "Admin")]
        [HttpGet] // GET: api/users
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                userDtos.Add(await MapUserWithRoles(user));
            }

            return Ok(userDtos);
        }

        [HttpGet("{username}")] // GET: api/users/{username}
        public async Task<ActionResult<ApplicationUser>> GetUser(string username)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.NormalizedUserName == username.ToUpper()
            );

            if (user == null)
                return NotFound();

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

        [HttpPut("{username}")] //PUT: api/users/{username}
        public async Task<ActionResult> UpdateUser(string username, UpdateUserDto updateUserDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.NormalizedUserName == username.ToUpper()
            );

            if (user == null)
                return NotFound();

            _mapper.Map(updateUserDto, user);
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{username}")] //DELETE: api/users/{username}
        public async Task<IActionResult> DeleteUser(string username)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.NormalizedUserName == username.ToUpper()
            );

            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        //[Authorize(Roles = "Admin")]
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
    }
}
