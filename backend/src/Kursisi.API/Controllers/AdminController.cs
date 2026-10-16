using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kursisi.API.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<DashboardSummaryDto>>> GetDashboardSummary()
    {
        var result = await _adminService.GetDashboardSummaryAsync();
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<List<AdminUserDto>>>> GetAllUsers()
    {
        var result = await _adminService.GetAllUsersAsync();
        return Ok(result);
    }

    [HttpPut("users/role")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateUserRole([FromBody] UpdateUserRoleDto dto)
    {
        var result = await _adminService.UpdateUserRoleAsync(dto);
        return Ok(result);
    }

    [HttpPut("users/status")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateUserStatus([FromBody] UpdateUserStatusDto dto)
    {
        var result = await _adminService.UpdateUserStatusAsync(dto);
        return Ok(result);
    }
}
