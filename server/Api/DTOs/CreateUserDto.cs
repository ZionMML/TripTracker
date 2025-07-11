namespace Api.DTOs;

public class CreateUserDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }

    public required string KnownAs { get; set; }
    public required string Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
}
