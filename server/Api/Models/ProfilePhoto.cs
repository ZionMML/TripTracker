namespace Api.Models;

public class ProfilePhoto
{
    public int Id { get; set; }

    public required string Url { get; set; }

    public string? PublicId { get; set; }
    public bool IsApproved { get; set; } = false;

    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; } = null;
}
