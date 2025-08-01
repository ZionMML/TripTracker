using System.Runtime.CompilerServices;
using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class TripRepository(
    ApplicationDbContext _context,
    IUserRepository userRepository,
    UserManager<ApplicationUser> userManager
) : ITripRepository
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<IEnumerable<Trip>> GetTripsByUsernameAsync(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);

        if (user == null)
            return [];

        var roles = await _userManager.GetRolesAsync(user);

        if (roles == null || roles.Count == 0)
            return [];

        if (roles.Contains("Admin"))
        {
            return await _context.Trips.Include(t => t.User).ToListAsync();
        }
        else
        {
            return await _context
                .Trips.Include(t => t.User)
                .Where(t => t.User != null && t.UserId == user.Id)
                .ToListAsync();
        }
    }

    public async Task<Trip?> GetTripByIdAsync(int id)
    {
        return await _context.Trips.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task AddTripAsync(Trip trip)
    {
        await _context.Trips.AddAsync(trip);
    }

    public void UpdateTrip(Trip trip)
    {
        _context.Entry(trip).State = EntityState.Modified;
    }

    public void DeleteTrip(Trip trip)
    {
        _context.Trips.Remove(trip);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
