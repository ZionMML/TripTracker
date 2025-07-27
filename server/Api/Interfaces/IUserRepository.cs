using Api.Models;

namespace Api.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
    Task<ApplicationUser?> GetUserByUsernameAsync(string username);
    Task<bool> SaveAllAsync();
    void Update(ApplicationUser user);
    void Delete(ApplicationUser user);
}
