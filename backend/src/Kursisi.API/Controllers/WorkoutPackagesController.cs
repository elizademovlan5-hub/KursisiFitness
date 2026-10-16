using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

public class WorkoutPackagesController : BaseApiController
{
    private readonly IWorkoutPackageService _packageService;

    public WorkoutPackagesController(IWorkoutPackageService packageService)
    {
        _packageService = packageService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WorkoutPackageDto>>>> GetAllPackages()
    {
        var result = await _packageService.GetAllPackagesAsync();
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ApiResponse<WorkoutPackageDto>>> GetPackageBySlug(string slug)
    {
        var result = await _packageService.GetPackageBySlugAsync(slug);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<WorkoutPackageDto>>> GetPackageById(int id)
    {
        var result = await _packageService.GetPackageByIdAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<WorkoutPackageDto>>> CreatePackage([FromBody] CreateWorkoutPackageDto dto)
    {
        int trainerId = GetCurrentUserId();
        var result = await _packageService.CreatePackageAsync(trainerId, dto);
        return Ok(result);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePackage(int id)
    {
        int userId = GetCurrentUserId();
        bool isAdmin = IsCurrentUserAdmin();
        var result = await _packageService.DeletePackageAsync(id, userId, isAdmin);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("adopt")]
    public async Task<ActionResult<ApiResponse<bool>>> AdoptPackage([FromBody] AdoptPackageDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _packageService.AdoptPackageToScheduleAsync(userId, dto);
        return Ok(result);
    }
}
