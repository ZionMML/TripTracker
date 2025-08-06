using Api.Models;

namespace API.DTOs;

public class TripDto
{
    public int Id { get; set; }
    public string? KnownAs { get; set; }

    public required string Start { get; set; }

    public DateTime StartDate { get; set; }

    public required string End { get; set; }

    public DateTime EndDate { get; set; }

    public string? TripInfo { get; set; }

    public required string Status { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime UpdatedDate { get; set; }

    public List<PhotoDto>? TripPhotos { get; set; }
}
