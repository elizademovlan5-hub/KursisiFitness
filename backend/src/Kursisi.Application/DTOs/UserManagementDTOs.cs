using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class AdminUserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string RoleName => Role.ToString();
    public bool IsEmailConfirmed { get; set; }
    public bool IsActive { get; set; }
    public string? AvatarUrl { get; set; }
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public FitnessGoal? TargetGoal { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalWorkoutsLogged { get; set; }
}

public class UpdateUserRoleDto
{
    public int UserId { get; set; }
    public UserRole Role { get; set; }
}

public class UpdateUserStatusDto
{
    public int UserId { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public FitnessGoal? TargetGoal { get; set; }
    public string? AvatarUrl { get; set; }
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class DashboardSummaryDto
{
    public int TotalUsers { get; set; }
    public int TotalExercises { get; set; }
    public int TotalPackages { get; set; }
    public int TotalWorkoutsCompleted { get; set; }
    public List<AdminUserDto> RecentUsers { get; set; } = new();
}
