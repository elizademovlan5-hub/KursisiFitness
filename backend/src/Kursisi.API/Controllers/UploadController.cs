using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

[Authorize]
public class UploadController : BaseApiController
{
    private readonly ICloudinaryService _cloudinaryService;

    public UploadController(ICloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    [HttpPost("image")]
    public async Task<ActionResult<ApiResponse<string>>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new AppException("Şəkil faylı seçilməyib.");

        if (file.Length > 10 * 1024 * 1024) // 10MB limit
            throw new AppException("Şəkil həcmi maksimum 10MB ola bilər.");

        using var stream = file.OpenReadStream();
        string url = await _cloudinaryService.UploadImageAsync(stream, file.FileName);

        return Ok(ApiResponse<string>.Ok(url, "Şəkil uğurla Cloud CDN-ə yükləndi."));
    }

    [HttpPost("video")]
    public async Task<ActionResult<ApiResponse<string>>> UploadVideo(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new AppException("Video faylı seçilməyib.");

        if (file.Length > 50 * 1024 * 1024) // 50MB limit
            throw new AppException("Video həcmi maksimum 50MB ola bilər.");

        using var stream = file.OpenReadStream();
        string url = await _cloudinaryService.UploadVideoAsync(stream, file.FileName);

        return Ok(ApiResponse<string>.Ok(url, "Video uğurla Cloud CDN-ə yükləndi."));
    }
}
