using Kursisi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<OtpCode> OtpCodes { get; }
    DbSet<Exercise> Exercises { get; }
    DbSet<WeeklyPlanItem> WeeklyPlanItems { get; }
    DbSet<WorkoutLog> WorkoutLogs { get; }
    DbSet<MonthlyProgress> MonthlyProgresses { get; }
    DbSet<WorkoutPackage> WorkoutPackages { get; }
    DbSet<PackageExercise> PackageExercises { get; }
    DbSet<Comment> Comments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
