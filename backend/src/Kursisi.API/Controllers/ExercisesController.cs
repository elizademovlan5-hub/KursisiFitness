using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

public class ExercisesController : BaseApiController
{
    private readonly IExerciseService _exerciseService;

    public ExercisesController(IExerciseService exerciseService)
    {
        _exerciseService = exerciseService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<ExerciseDto>>>> GetExercises([FromQuery] ExerciseFilterParams filterParams)
    {
        var result = await _exerciseService.GetExercisesAsync(filterParams);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<ExerciseDto>>>> GetFeaturedExercises()
    {
        var result = await _exerciseService.GetFeaturedExercisesAsync();
        return Ok(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ApiResponse<ExerciseDto>>> GetExerciseBySlug(string slug)
    {
        var result = await _exerciseService.GetExerciseBySlugAsync(slug);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<ExerciseDto>>> GetExerciseById(int id)
    {
        var result = await _exerciseService.GetExerciseByIdAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Trainer")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ExerciseDto>>> CreateExercise([FromBody] CreateExerciseDto dto)
    {
        var result = await _exerciseService.CreateExerciseAsync(dto);
        return CreatedAtAction(nameof(GetExerciseById), new { id = result.Data!.Id }, result);
    }

    [Authorize(Roles = "Admin,Trainer")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<ExerciseDto>>> UpdateExercise(int id, [FromBody] UpdateExerciseDto dto)
    {
        var result = await _exerciseService.UpdateExerciseAsync(id, dto);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteExercise(int id)
    {
        var result = await _exerciseService.DeleteExerciseAsync(id);
        return Ok(result);
    }
}
