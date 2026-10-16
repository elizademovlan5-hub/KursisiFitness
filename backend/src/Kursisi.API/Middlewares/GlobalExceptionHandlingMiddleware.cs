using System.Net;
using System.Text.Json;
using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;

namespace Kursisi.API.Middlewares;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ApiResponse<object>
        {
            Success = false,
            Message = exception.Message
        };

        switch (exception)
        {
            case NotFoundException notFound:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                break;

            case UnauthorizedAppException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;

            case ValidationAppException valEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Errors = valEx.Errors;
                break;

            case AppException appEx:
                context.Response.StatusCode = appEx.StatusCode;
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "Daxili server xətası baş verdi. Zəhmət olmasa bir qədər sonra yenidən cəhd edin.";
                break;
        }

        string result = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        return context.Response.WriteAsync(result);
    }
}
