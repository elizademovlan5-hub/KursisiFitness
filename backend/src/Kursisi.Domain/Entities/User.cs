using Kursisi.Domain.Common;
using Kursisi.Domain.Enums;

namespace Kursisi.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public bool IsEmailConfirmed { get; set; } = false;
    public string? AvatarUrl { get; set; }
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public FitnessGoal? TargetGoal { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation collections
    public ICollection<WeeklyPlanItem> WeeklyPlans { get; set; } = new List<WeeklyPlanItem>();
    public ICollection<WorkoutLog> WorkoutLogs { get; set; } = new List<WorkoutLog>();
    public ICollection<MonthlyProgress> MonthlyProgresses { get; set; } = new List<MonthlyProgress>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<WorkoutPackage> CreatedPackages { get; set; } = new List<WorkoutPackage>();
}
