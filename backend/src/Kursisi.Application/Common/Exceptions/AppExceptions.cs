namespace Kursisi.Application.Common.Exceptions;

public class AppException : Exception
{
    public int StatusCode { get; set; } = 400;

    public AppException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }
}

public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message, 404)
    {
    }
}

public class ValidationAppException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationAppException(IDictionary<string, string[]> errors) 
        : base("One or more validation failures have occurred.", 400)
    {
        Errors = errors;
    }
}

public class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message = "İcazəniz yoxdur.") : base(message, 401)
    {
    }
}
