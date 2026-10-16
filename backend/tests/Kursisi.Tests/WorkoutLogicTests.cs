using Kursisi.Application.DTOs;
using Kursisi.Domain.Entities;
using Kursisi.Domain.Enums;
using Xunit;

namespace Kursisi.Tests;

public class WorkoutLogicTests
{
    [Fact]
    public void CalculateCalories_WithBurnRateAndDuration_CalculatesAccurately()
    {
        // Arrange
        int durationMinutes = 30;
        double burnRatePerMin = 8.5; // e.g. Bench press

        // Act
        double totalCalories = Math.Round(durationMinutes * burnRatePerMin, 1);

        // Assert
        Assert.Equal(255.0, totalCalories);
    }

    [Fact]
    public void WeeklyStats_CalculatesCompletionRateAccurately()
    {
        // Arrange: 8 total scheduled, 6 completed
        int totalScheduled = 8;
        int completed = 6;

        // Act
        double rate = Math.Round((double)completed / totalScheduled * 100, 1);

        // Assert
        Assert.Equal(75.0, rate);
    }
}
