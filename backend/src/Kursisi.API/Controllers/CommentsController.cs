using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

public class CommentsController : BaseApiController
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("exercise/{slug}")]
    public async Task<ActionResult<ApiResponse<List<CommentDto>>>> GetCommentsByExercise(string slug)
    {
        var result = await _commentService.GetCommentsByExerciseSlugAsync(slug);
        return Ok(result);
    }

    [HttpGet("package/{slug}")]
    public async Task<ActionResult<ApiResponse<List<CommentDto>>>> GetCommentsByPackage(string slug)
    {
        var result = await _commentService.GetCommentsByPackageSlugAsync(slug);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CommentDto>>> AddComment([FromBody] CreateCommentDto dto)
    {
        int userId = GetCurrentUserId();
        var result = await _commentService.AddCommentAsync(userId, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteComment(int id)
    {
        int userId = GetCurrentUserId();
        bool isAdmin = IsCurrentUserAdmin();
        var result = await _commentService.DeleteCommentAsync(userId, id, isAdmin);
        return Ok(result);
    }
}
