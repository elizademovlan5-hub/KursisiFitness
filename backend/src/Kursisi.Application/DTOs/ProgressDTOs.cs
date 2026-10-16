namespace Kursisi.Application.DTOs;

public class MonthlyProgressDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string MonthYear { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public double WeightKg { get; set; }
    public double? ChestCm { get; set; }
    public double? WaistCm { get; set; }
    public double? ArmCm { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateMonthlyProgressDto
{
    public string MonthYear { get; set; } = string.Empty; // e.g. "2026-05"
    public string PhotoUrl { get; set; } = string.Empty;  // Cloudinary URL
    public double WeightKg { get; set; }
    public double? ChestCm { get; set; }
    public double? WaistCm { get; set; }
    public double? ArmCm { get; set; }
    public string? Notes { get; set; }
}
