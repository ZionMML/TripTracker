using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class ApplicationUser : IdentityUser
{
    public required string KnownAs { get; set; }

    public DateOnly DateOfBirth { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public required string Gender { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
    public string? FirstContactName { get; set; }
    public string? FirstContactPhNo { get; set; }
    public string? SecondContactName { get; set; }
    public string? SecondContactPhNo { get; set; }
    public string? About { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }

    public ProfilePhoto? ProfilePhoto { get; set; } = null;
}
