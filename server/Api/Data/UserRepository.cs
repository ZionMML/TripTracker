using Api.Data;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class UserRepository(ApplicationDbContext _context) : IUserRepository
{
    public void Delete(ApplicationUser user)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
    {
        return await _context.Users.Include(u => u.ProfilePhoto).ToListAsync();
    }

    public async Task<ApplicationUser?> GetUserByUsernameAsync(string username)
    {
        return await _context
            .Users.Include(u => u.ProfilePhoto)
            .FirstOrDefaultAsync(u => u.NormalizedUserName == username.ToUpper());
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(ApplicationUser user)
    {
        _context.Users.Remove(user);
    }
}
