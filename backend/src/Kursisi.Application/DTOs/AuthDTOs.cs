using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public FitnessGoal? TargetGoal { get; set; }
}

public class VerifyOtpRequest
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class GoogleLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? GoogleId { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string RoleName => Role.ToString();
    public string? AvatarUrl { get; set; }
    public double? HeightCm { get; set; }
    public double? WeightKg { get; set; }
    public FitnessGoal? TargetGoal { get; set; }
    public bool IsEmailConfirmed { get; set; }
}
