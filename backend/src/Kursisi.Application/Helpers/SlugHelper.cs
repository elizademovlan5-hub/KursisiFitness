using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Kursisi.Application.Helpers;

public static class SlugHelper
{
    public static string GenerateSlug(string phrase)
    {
        if (string.IsNullOrWhiteSpace(phrase))
            return Guid.NewGuid().ToString("N")[..8];

        string str = phrase.ToLowerInvariant();

        // Replace Azerbaijani and common non-ASCII characters
        str = str.Replace("ə", "e")
                 .Replace("ı", "i")
                 .Replace("ö", "o")
                 .Replace("ü", "u")
                 .Replace("ş", "s")
                 .Replace("ç", "c")
                 .Replace("ğ", "g")
                 .Replace("Ə", "e")
                 .Replace("I", "i")
                 .Replace("İ", "i")
                 .Replace("Ö", "o")
                 .Replace("Ü", "u")
                 .Replace("Ş", "s")
                 .Replace("Ç", "c")
                 .Replace("Ğ", "g");

        // Remove invalid characters
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        // Convert multiple spaces into one space
        str = Regex.Replace(str, @"\s+", " ").Trim();
        // Cut and trim
        str = str.Substring(0, str.Length <= 80 ? str.Length : 80).Trim();
        // Replace spaces by dashes
        str = Regex.Replace(str, @"\s", "-");

        return string.IsNullOrEmpty(str) ? Guid.NewGuid().ToString("N")[..8] : str;
    }
}
