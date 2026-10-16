using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

[Authorize]
public class WorkoutPlansController : BaseApiController
{
    private readonly IWorkoutPlanService _planService;

    public WorkoutPlansController(IWorkoutPlanService planService)
    {
        _planService = planService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WeeklyPlanItemDto>>>> GetWeeklyPlan()
    {
        int userId = GetCurrentUserId();
        var result = await _planService.GetWeeklyPlanAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<WeeklyPlanItemDto>>> AddToPlan([FromBody] AddToPlanDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _planService.AddToPlanAsync(userId, dto);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<WeeklyPlanItemDto>>> UpdatePlanItem(int id, [FromBody] UpdatePlanItemDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _planService.UpdatePlanItemAsync(userId, id, dto);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePlanItem(int id)
    {
        int userId = GetCurrentUserId();
        var result = await _planService.DeletePlanItemAsync(userId, id);
        return Ok(result);
    }

    [HttpPost("complete")]
    public async Task<ActionResult<ApiResponse<WorkoutLogDto>>> CompleteWorkout([FromBody] CompleteWorkoutDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _planService.CompleteWorkoutAsync(userId, dto);
        return Ok(result);
    }

    [HttpGet("daily/{day}")]
    public async Task<ActionResult<ApiResponse<DailySummaryDto>>> GetDailySummary(DayOfWeekEnum day)
    {
        int userId = GetCurrentUserId();
        var result = await _planService.GetDailySummaryAsync(userId, day);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<WeeklyStatsDto>>> GetWeeklyStats()
    {
        int userId = GetCurrentUserId();
        var result = await _planService.GetWeeklyStatsAsync(userId);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<ActionResult<ApiResponse<List<WorkoutLogDto>>>> GetWorkoutHistory()
    {
        int userId = GetCurrentUserId();
        var result = await _planService.GetWorkoutHistoryAsync(userId);
        return Ok(result);
    }
}
