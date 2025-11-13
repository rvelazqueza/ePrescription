using System.Text.RegularExpressions;

namespace EPrescription.Domain.ValueObjects;

/// <summary>
/// IdentificationNumber value object - Costa Rica cédula validation
/// Format: X-XXXX-XXXX (9 digits) or passport/DIMEX
/// </summary>
public sealed class IdentificationNumber : IEquatable<IdentificationNumber>
{
    private static readonly Regex CedulaRegex = new(
        @"^\d{1}-?\d{4}-?\d{4}$",
        RegexOptions.Compiled);

    public string Value { get; }
    public string Formatted { get; }
    public IdentificationType Type { get; }

    private IdentificationNumber(string value, string formatted, IdentificationType type)
    {
        Value = value;
        Formatted = formatted;
        Type = type;
    }

    public static IdentificationNumber Create(string identification)
    {
        if (string.IsNullOrWhiteSpace(identification))
            throw new ArgumentException("Identification number cannot be empty", nameof(identification));

        identification = identification.Trim().ToUpperInvariant();

        // Remove hyphens for validation
        var digitsOnly = identification.Replace("-", "").Replace(" ", "");

        // Check if it's a Costa Rica cédula (9 digits)
        if (digitsOnly.Length == 9 && digitsOnly.All(char.IsDigit))
        {
            var formatted = $"{digitsOnly.Substring(0, 1)}-{digitsOnly.Substring(1, 4)}-{digitsOnly.Substring(5, 4)}";
            return new IdentificationNumber(digitsOnly, formatted, IdentificationType.Cedula);
        }

        // Check if it's DIMEX (11-12 digits)
        if (digitsOnly.Length >= 11 && digitsOnly.Length <= 12 && digitsOnly.All(char.IsDigit))
        {
            return new IdentificationNumber(digitsOnly, digitsOnly, IdentificationType.DIMEX);
        }

        // Otherwise treat as passport (alphanumeric)
        if (identification.Length >= 6 && identification.Length <= 20)
        {
            return new IdentificationNumber(identification, identification, IdentificationType.Passport);
        }

        throw new ArgumentException(
            $"Invalid identification format: {identification}. Expected cédula (9 digits), DIMEX (11-12 digits), or passport",
            nameof(identification));
    }

    public static IdentificationNumber? CreateOrNull(string? identification)
    {
        if (string.IsNullOrWhiteSpace(identification))
            return null;

        return Create(identification);
    }

    public override string ToString() => Formatted;

    public bool Equals(IdentificationNumber? other)
    {
        if (other is null) return false;
        return Value == other.Value;
    }

    public override bool Equals(object? obj) => obj is IdentificationNumber id && Equals(id);

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(IdentificationNumber? left, IdentificationNumber? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(IdentificationNumber? left, IdentificationNumber? right) => !(left == right);

    public static implicit operator string(IdentificationNumber id) => id.Formatted;
}

public enum IdentificationType
{
    Cedula,    // Costa Rica national ID
    DIMEX,     // Foreign resident ID
    Passport   // International passport
}
