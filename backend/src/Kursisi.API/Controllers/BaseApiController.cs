using System.Security.Claims;
using Kursisi.Application.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected int GetCurrentUserId()
    {
        string? userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
        {
            throw new UnauthorizedAppException("İstifadəçi autentifikasiya olunmayıb.");
        }
        return userId;
    }

    protected bool IsCurrentUserAdmin()
    {
        return User.IsInRole("Admin");
    }
}
