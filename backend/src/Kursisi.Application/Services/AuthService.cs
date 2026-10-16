using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Kursisi.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Kursisi.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenService _jwtService;
    private readonly IEmailService _emailService;

    public AuthService(
        IApplicationDbContext context,
        IJwtTokenService jwtService,
        IEmailService emailService)
    {
        _context = context;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    public async Task<ApiResponse<string>> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException("Email və şifrə mütləq daxil edilməlidir.");

        string normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (existingUser != null)
        {
            if (!existingUser.IsEmailConfirmed)
            {
                // Resend OTP code if email was not verified yet
                string resendCode = Generate6DigitCode();
                var newOtp = new OtpCode
                {
                    Email = normalizedEmail,
                    Code = resendCode,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                };
                _context.OtpCodes.Add(newOtp);
                await _context.SaveChangesAsync();
                await _emailService.SendOtpEmailAsync(normalizedEmail, resendCode);

                return ApiResponse<string>.Ok(
                    normalizedEmail,
                    "Bu email artıq qeydiyyatdan keçib, lakin təsdiqlənməyib. Yeni OTP kod emailinizə göndərildi."
                );
            }

            throw new AppException("Bu email artıq qeydiyyatdan keçib.", 409);
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = UserRole.User,
            IsEmailConfirmed = false,
            HeightCm = request.HeightCm,
            WeightKg = request.WeightKg,
            TargetGoal = request.TargetGoal ?? FitnessGoal.Maintenance,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        // Generate 6-digit OTP code
        string otpCode = Generate6DigitCode();
        var otp = new OtpCode
        {
            Email = normalizedEmail,
            Code = otpCode,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
        _context.OtpCodes.Add(otp);

        await _context.SaveChangesAsync();

        // Send OTP email
        await _emailService.SendOtpEmailAsync(normalizedEmail, otpCode);

        return ApiResponse<string>.Ok(
            normalizedEmail,
            "Qeydiyyat mərhələsi uğurla başlandı! Emailinizə 6 rəqəmli OTP təsdiq kodu göndərildi."
        );
    }

    public async Task<ApiResponse<AuthResponse>> VerifyOtpAsync(VerifyOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Code))
            throw new AppException("Email və OTP kod mütləq daxil edilməlidir.");

        string normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var otpRecord = await _context.OtpCodes
            .Where(o => o.Email == normalizedEmail && o.Code == request.Code.Trim() && !o.IsUsed)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpRecord == null || otpRecord.ExpiresAt < DateTime.UtcNow)
        {
            throw new AppException("Daxil edilən OTP kod yanlışdır və ya vaxtı bitmişdir.", 400);
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        otpRecord.IsUsed = true;
        user.IsEmailConfirmed = true;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        string token = _jwtService.GenerateToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            User = MapToUserDto(user)
        }, "Email təsdiqləndi və sistemə daxil olundu.");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException("Email və şifrə mütləq daxil edilməlidir.");

        string normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new AppException("Email və ya şifrə yanlışdır.", 401);
        }

        if (!user.IsActive)
            throw new AppException("Hesabınız admin tərəfindən deaktiv edilib.", 403);

        if (!user.IsEmailConfirmed)
        {
            // Resend OTP so user can confirm
            string otpCode = Generate6DigitCode();
            _context.OtpCodes.Add(new OtpCode
            {
                Email = normalizedEmail,
                Code = otpCode,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            });
            await _context.SaveChangesAsync();
            await _emailService.SendOtpEmailAsync(normalizedEmail, otpCode);

            throw new AppException("Email ünvanınız təsdiqlənməyib. Yeni OTP kod emailinizə göndərildi. Zəhmət olmasa təsdiqləyin.", 403);
        }

        string token = _jwtService.GenerateToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            User = MapToUserDto(user)
        }, "Uğurla daxil oldunuz.");
    }

    public async Task<ApiResponse<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new AppException("Google email məlumatı tapılmadı.");

        string normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user == null)
        {
            user = new User
            {
                FullName = !string.IsNullOrWhiteSpace(request.FullName) ? request.FullName : "Google User",
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                Role = UserRole.User,
                IsEmailConfirmed = true,
                AvatarUrl = request.AvatarUrl,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            if (!user.IsActive)
                throw new AppException("Hesabınız deaktiv edilib.", 403);

            if (!string.IsNullOrWhiteSpace(request.AvatarUrl) && string.IsNullOrWhiteSpace(user.AvatarUrl))
            {
                user.AvatarUrl = request.AvatarUrl;
                await _context.SaveChangesAsync();
            }
        }

        string token = _jwtService.GenerateToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            User = MapToUserDto(user)
        }, "Google vasitəsilə uğurla daxil oldunuz.");
    }

    public async Task<ApiResponse<UserDto>> GetProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        return ApiResponse<UserDto>.Ok(MapToUserDto(user));
    }

    public async Task<ApiResponse<UserDto>> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.Trim();

        if (dto.HeightCm.HasValue)
            user.HeightCm = dto.HeightCm.Value;

        if (dto.WeightKg.HasValue)
            user.WeightKg = dto.WeightKg.Value;

        if (dto.TargetGoal.HasValue)
            user.TargetGoal = dto.TargetGoal.Value;

        if (!string.IsNullOrWhiteSpace(dto.AvatarUrl))
            user.AvatarUrl = dto.AvatarUrl;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<UserDto>.Ok(MapToUserDto(user), "Profil məlumatları yeniləndi.");
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new AppException("Cari şifrə yanlışdır.", 400);

        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
            throw new AppException("Yeni şifrə ən azı 6 simvol olmalıdır.", 400);

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Şifrə uğurla dəyişdirildi.");
    }

    private static string Generate6DigitCode()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            HeightCm = user.HeightCm,
            WeightKg = user.WeightKg,
            TargetGoal = user.TargetGoal,
            IsEmailConfirmed = user.IsEmailConfirmed
        };
    }
}
