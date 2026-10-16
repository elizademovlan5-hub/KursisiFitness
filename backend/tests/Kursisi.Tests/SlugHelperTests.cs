using Kursisi.Application.Helpers;
using Xunit;

namespace Kursisi.Tests;

public class SlugHelperTests
{
    [Fact]
    public void GenerateSlug_WithAzerbaijaniCharacters_TransliteratesProperly()
    {
        // Arrange
        string title = "Çiyin və Əzələ Məşqi Ştanqla";

        // Act
        string slug = SlugHelper.GenerateSlug(title);

        // Assert
        Assert.Equal("ciyin-ve-ezele-mesqi-stanqla", slug);
    }

    [Fact]
    public void GenerateSlug_WithSpecialCharactersAndExtraSpaces_SanitizesCorrectly()
    {
        // Arrange
        string title = "   Barbell   Bench  Press  (100kg!) & Dips???   ";

        // Act
        string slug = SlugHelper.GenerateSlug(title);

        // Assert
        Assert.Equal("barbell-bench-press-100kg-dips", slug);
    }

    [Fact]
    public void GenerateSlug_WithEmptyOrNull_ReturnsNonEmptyFallback()
    {
        // Act
        string slug1 = SlugHelper.GenerateSlug("");
        string slug2 = SlugHelper.GenerateSlug("    ");

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(slug1));
        Assert.False(string.IsNullOrWhiteSpace(slug2));
    }
}
