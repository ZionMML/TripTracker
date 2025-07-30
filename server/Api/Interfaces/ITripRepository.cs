using Api.Models;

namespace Api.Interfaces;

public interface ITripRepository
{
    Task<IEnumerable<Trip>> GetTripsByUserIdAsync(string userId);
    Task<Trip?> GetTripByIdAsync(int id);
    Task AddTripAsync(Trip trip);
    void UpdateTrip(Trip trip);
    void DeleteTrip(Trip trip);
    Task<bool> SaveAllAsync();
}
