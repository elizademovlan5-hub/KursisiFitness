using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<WeeklyPlanItem> WeeklyPlanItems => Set<WeeklyPlanItem>();
    public DbSet<WorkoutLog> WorkoutLogs => Set<WorkoutLog>();
    public DbSet<MonthlyProgress> MonthlyProgresses => Set<MonthlyProgress>();
    public DbSet<WorkoutPackage> WorkoutPackages => Set<WorkoutPackage>();
    public DbSet<PackageExercise> PackageExercises => Set<PackageExercise>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(100);
        });

        // OtpCode
        modelBuilder.Entity<OtpCode>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.HasIndex(o => o.Email);
            entity.Property(o => o.Code).IsRequired().HasMaxLength(10);
        });

        // Exercise
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(160);
        });

        // WeeklyPlanItem
        modelBuilder.Entity<WeeklyPlanItem>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.User)
                  .WithMany(u => u.WeeklyPlans)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Exercise)
                  .WithMany(e => e.WeeklyPlanItems)
                  .HasForeignKey(p => p.ExerciseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WorkoutLog
        modelBuilder.Entity<WorkoutLog>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.HasOne(l => l.User)
                  .WithMany(u => u.WorkoutLogs)
                  .HasForeignKey(l => l.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Exercise)
                  .WithMany()
                  .HasForeignKey(l => l.ExerciseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // MonthlyProgress
        modelBuilder.Entity<MonthlyProgress>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.HasOne(m => m.User)
                  .WithMany(u => u.MonthlyProgresses)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // WorkoutPackage
        modelBuilder.Entity<WorkoutPackage>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.Property(p => p.Title).IsRequired().HasMaxLength(150);
            entity.Property(p => p.Slug).IsRequired().HasMaxLength(160);

            entity.HasOne(p => p.Trainer)
                  .WithMany(u => u.CreatedPackages)
                  .HasForeignKey(p => p.TrainerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // PackageExercise
        modelBuilder.Entity<PackageExercise>(entity =>
        {
            entity.HasKey(pe => pe.Id);
            entity.HasOne(pe => pe.WorkoutPackage)
                  .WithMany(p => p.PackageExercises)
                  .HasForeignKey(pe => pe.WorkoutPackageId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pe => pe.Exercise)
                  .WithMany(e => e.PackageExercises)
                  .HasForeignKey(pe => pe.ExerciseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasOne(c => c.User)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Exercise)
                  .WithMany(e => e.Comments)
                  .HasForeignKey(c => c.ExerciseId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.WorkoutPackage)
                  .WithMany(p => p.Comments)
                  .HasForeignKey(c => c.WorkoutPackageId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
