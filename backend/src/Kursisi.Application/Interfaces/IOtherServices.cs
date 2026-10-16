using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;

namespace Kursisi.Application.Interfaces;

public interface IRecommendationService
{
    Task<ApiResponse<RecommendationResponse>> GetRecommendationAsync(RecommendationRequest request);
}

public interface IProgressService
{
    Task<ApiResponse<List<MonthlyProgressDto>>> GetUserProgressAsync(int userId);
    Task<ApiResponse<MonthlyProgressDto>> AddProgressAsync(int userId, CreateMonthlyProgressDto dto);
    Task<ApiResponse<bool>> DeleteProgressAsync(int userId, int progressId);
}

public interface ICommentService
{
    Task<ApiResponse<List<CommentDto>>> GetCommentsByExerciseSlugAsync(string slug);
    Task<ApiResponse<List<CommentDto>>> GetCommentsByPackageSlugAsync(string slug);
    Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CreateCommentDto dto);
    Task<ApiResponse<bool>> DeleteCommentAsync(int userId, int commentId, bool isAdmin);
}

public interface IAdminService
{
    Task<ApiResponse<DashboardSummaryDto>> GetDashboardSummaryAsync();
    Task<ApiResponse<List<AdminUserDto>>> GetAllUsersAsync();
    Task<ApiResponse<bool>> UpdateUserRoleAsync(UpdateUserRoleDto dto);
    Task<ApiResponse<bool>> UpdateUserStatusAsync(UpdateUserStatusDto dto);
}
