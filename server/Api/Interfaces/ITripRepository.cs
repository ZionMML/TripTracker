using Api.Models;

namespace Api.Interfaces;

public interface ITripRepository
{
    Task<IEnumerable<Trip>> GetTripsByUsernameAsync(string username);
    Task<Trip?> GetTripByIdAsync(int id);
    Task AddTripAsync(Trip trip);
    void UpdateTrip(Trip trip);
    void DeleteTrip(Trip trip);
    Task<bool> SaveAllAsync();
}
