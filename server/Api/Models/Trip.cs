namespace Api.Models;

public class Trip
{
    public int Id { get; set; }

    public required string Start { get; set; }

    public DateTime StartDate { get; set; }

    public required string End { get; set; }

    public DateTime EndDate { get; set; }

    public string? TripInfo { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    public string? UserId { get; set; }

    public ApplicationUser? User { get; set; } = null;
}
