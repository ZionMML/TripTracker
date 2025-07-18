namespace Api.DTOs;

public class CreateUserDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }

    public required string KnownAs { get; set; }
    public required string Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }

    public string? FirstContactName { get; set; }
    public string? FirstContactPhNo { get; set; }
    public string? SecondContactName { get; set; }
    public string? SecondContactPhNo { get; set; }
    public string? About { get; set; }
}
