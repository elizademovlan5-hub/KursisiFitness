namespace Kursisi.Application.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatarUrl { get; set; }
    public int? ExerciseId { get; set; }
    public int? WorkoutPackageId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCommentDto
{
    public int? ExerciseId { get; set; }
    public int? WorkoutPackageId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
}
