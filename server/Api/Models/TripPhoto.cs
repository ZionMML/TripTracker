namespace Api.Models;

public class TripPhoto
{
    public int Id { get; set; }
    public required string Url { get; set; }

    public string? PublicId { get; set; }
    public bool IsApproved { get; set; } = false;
    public int TripId { get; set; }
    public Trip? Trip { get; set; } = null;
}
