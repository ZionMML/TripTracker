using Api.Data;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class UserRepository(ApplicationDbContext _context) : IUserRepository
{
    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        return await _context
            .Users.Include(u => u.ProfilePhoto)
            .Include(u => u.Trips)
            .ToListAsync();
    }

    public async Task<ApplicationUser?> GetUserByUsernameAsync(string username)
    {
        return await _context
            .Users.Include(u => u.ProfilePhoto)
            .Include(u => u.Trips)
            .FirstOrDefaultAsync(u => u.NormalizedUserName == username.ToUpper());
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(ApplicationUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public void Delete(ApplicationUser user)
    {
        _context.Users.Remove(user);
    }

    public void DeleteProfilePhoto(ProfilePhoto photo)
    {
        _context.Entry(photo).State = EntityState.Deleted;
    }
}
