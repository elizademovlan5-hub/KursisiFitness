using Kursisi.Domain.Common;
using Kursisi.Domain.Enums;

namespace Kursisi.Domain.Entities;

public class PackageExercise : BaseEntity
{
    public int WorkoutPackageId { get; set; }
    public WorkoutPackage WorkoutPackage { get; set; } = null!;

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public DayOfWeekEnum DayOfWeek { get; set; }
    public int Sets { get; set; } = 3;
    public int Reps { get; set; } = 12;
    public int RestSeconds { get; set; } = 60;
    public int OrderIndex { get; set; } = 1;
}
