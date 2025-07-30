using System.Runtime.CompilerServices;
using Api.Interfaces;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class TripRepository(ApplicationDbContext _context) : ITripRepository
{
    public async Task<IEnumerable<Trip>> GetTripsByUserIdAsync(string userId)
    {
        return await _context.Trips.Where(t => t.User != null && t.UserId == userId).ToListAsync();
    }

    public async Task<Trip?> GetTripByIdAsync(int id)
    {
        return await _context.Trips.FindAsync(id);
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
