using Kursisi.Domain.Common;

namespace Kursisi.Domain.Entities;

public class MonthlyProgress : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string MonthYear { get; set; } = string.Empty; // e.g. "2026-05"
    public string PhotoUrl { get; set; } = string.Empty;  // Cloudinary image
    public double WeightKg { get; set; }
    public double? ChestCm { get; set; }
    public double? WaistCm { get; set; }
    public double? ArmCm { get; set; }
    public string? Notes { get; set; }
}
