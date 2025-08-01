using API.DTOs;

namespace Api.DTOs;

public class UserDto
{
    public string? Username { get; set; }
    public string? KnownAs { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Role { get; set; }
    public string? FirstContactName { get; set; }
    public string? FirstContactPhNo { get; set; }
    public string? SecondContactName { get; set; }
    public string? SecondContactPhNo { get; set; }
    public string? About { get; set; }

    public string? ProfilePhotoUrl { get; set; }
    public int? ProfilePhotoId { get; set; }

    public List<TripDto>? Trips { get; set; }
}
