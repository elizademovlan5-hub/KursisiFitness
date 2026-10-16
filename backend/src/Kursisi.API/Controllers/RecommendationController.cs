using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

public class RecommendationController : BaseApiController
{
    private readonly IRecommendationService _recommendationService;

    public RecommendationController(IRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<RecommendationResponse>>> GetRecommendation([FromBody] RecommendationRequest request)
    {
        var result = await _recommendationService.GetRecommendationAsync(request);
        return Ok(result);
    }
}
