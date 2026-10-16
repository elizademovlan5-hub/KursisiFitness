using Kursisi.Application.Helpers;
using Kursisi.Domain.Enums;
using Xunit;

namespace Kursisi.Tests;

public class BmiCalculatorTests
{
    [Fact]
    public void Calculate_WithNormalWeight_ReturnsNormalCategory()
    {
        // Arrange: 180cm, 75kg
        double height = 180;
        double weight = 75;

        // Act
        var result = BmiCalculator.Calculate(height, weight, FitnessGoal.Maintenance);

        // Assert
        Assert.True(result.Bmi >= 18.5 && result.Bmi < 25.0);
        Assert.Contains("Normal", result.Category);
        Assert.NotEmpty(result.IdealWeightRange);
        Assert.True(result.RecommendedDailyCalories > 1500);
    }

    [Fact]
    public void Calculate_WithWeightLossGoal_RecommendsCaloricDeficitAndCardio()
    {
        // Arrange: 175cm, 90kg (Overweight), Goal: WeightLoss
        double height = 175;
        double weight = 90;

        // Act
        var result = BmiCalculator.Calculate(height, weight, FitnessGoal.WeightLoss);

        // Assert
        Assert.Contains("Overweight", result.Category);
        Assert.Contains("Cardio", result.FocusMuscleGroups);
        Assert.Contains("Kalori defisiti", result.Advice);
    }

    [Fact]
    public void Calculate_WithMuscleGainGoal_RecommendsCaloricSurplusAndResistanceTraining()
    {
        // Arrange: 182cm, 70kg, Goal: MuscleGain
        double height = 182;
        double weight = 70;

        // Act
        var result = BmiCalculator.Calculate(height, weight, FitnessGoal.MuscleGain);

        // Assert
        Assert.Contains("Chest", result.FocusMuscleGroups);
        Assert.Contains("Back", result.FocusMuscleGroups);
        Assert.Contains("Zülal qəbulunu", result.Advice);
    }

    [Theory]
    [InlineData(0, 70)]
    [InlineData(180, 0)]
    [InlineData(-10, -5)]
    public void Calculate_WithInvalidInputs_HandlesGracefullyWithoutThrowing(double height, double weight)
    {
        // Act
        var result = BmiCalculator.Calculate(height, weight, FitnessGoal.Maintenance);

        // Assert
        Assert.Equal(0, result.Bmi);
        Assert.Contains("natamam", result.Category);
    }
}
