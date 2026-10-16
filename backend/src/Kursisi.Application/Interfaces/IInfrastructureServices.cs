using System.IO;
using Kursisi.Domain.Entities;

namespace Kursisi.Application.Interfaces;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName);
    Task<string> UploadVideoAsync(Stream fileStream, string fileName);
}

public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string otpCode);
}

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
