namespace API.DTOs;

public class UpdateTripDto
{
    public required string Start { get; set; }

    public DateTime StartDate { get; set; }

    public required string End { get; set; }

    public DateTime EndDate { get; set; }

    public string? TripInfo { get; set; }

    public DateTime UpdatedDate { get; set; }
}
