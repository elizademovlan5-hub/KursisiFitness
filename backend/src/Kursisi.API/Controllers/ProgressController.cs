using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

[Authorize]
public class ProgressController : BaseApiController
{
    private readonly IProgressService _progressService;

    public ProgressController(IProgressService progressService)
    {
        _progressService = progressService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<MonthlyProgressDto>>>> GetUserProgress()
    {
        int userId = GetCurrentUserId();
        var result = await _progressService.GetUserProgressAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<MonthlyProgressDto>>> AddProgress([FromBody] CreateMonthlyProgressDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _progressService.AddProgressAsync(userId, dto);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteProgress(int id)
    {
        int userId = GetCurrentUserId();
        var result = await _progressService.DeleteProgressAsync(userId, id);
        return Ok(result);
    }
}
