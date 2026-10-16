using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;

namespace Kursisi.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<string>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<AuthResponse>> VerifyOtpAsync(VerifyOtpRequest request);
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request);
    Task<ApiResponse<UserDto>> GetProfileAsync(int userId);
    Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<ApiResponse<bool>> ChangePasswordAsync(int userId, ChangePasswordDto dto);
}
