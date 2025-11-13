using System.Text.RegularExpressions;

namespace EPrescription.Domain.ValueObjects;

/// <summary>
/// PhoneNumber value object - immutable phone number with Costa Rica format validation
/// Supports formats: +506-1234-5678, 1234-5678, 12345678
/// </summary>
public sealed class PhoneNumber : IEquatable<PhoneNumber>
{
    private static readonly Regex PhoneRegex = new(
        @"^(\+?506[-\s]?)?(\d{4})[-\s]?(\d{4})$",
        RegexOptions.Compiled);

    public string Value { get; }
    public string Formatted { get; }

    private PhoneNumber(string value, string formatted)
    {
        Value = value;
        Formatted = formatted;
    }

    public static PhoneNumber Create(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            throw new ArgumentException("Phone number cannot be empty", nameof(phone));

        phone = phone.Trim();

        var match = PhoneRegex.Match(phone);
        if (!match.Success)
            throw new ArgumentException($"Invalid phone format: {phone}. Expected format: +506-1234-5678 or 1234-5678", nameof(phone));

        // Extract digits only
        var digitsOnly = Regex.Replace(phone, @"[^\d]", "");
        
        // Remove country code if present
        if (digitsOnly.StartsWith("506") && digitsOnly.Length == 11)
            digitsOnly = digitsOnly.Substring(3);

        if (digitsOnly.Length != 8)
            throw new ArgumentException("Costa Rica phone numbers must have 8 digits", nameof(phone));

        // Format as XXXX-XXXX
        var formatted = $"{digitsOnly.Substring(0, 4)}-{digitsOnly.Substring(4, 4)}";

        return new PhoneNumber(digitsOnly, formatted);
    }

    public static PhoneNumber? CreateOrNull(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return null;

        return Create(phone);
    }

    public string ToInternational() => $"+506-{Formatted}";

    public override string ToString() => Formatted;

    public bool Equals(PhoneNumber? other)
    {
        if (other is null) return false;
        return Value == other.Value;
    }

    public override bool Equals(object? obj) => obj is PhoneNumber phone && Equals(phone);

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(PhoneNumber? left, PhoneNumber? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(PhoneNumber? left, PhoneNumber? right) => !(left == right);

    public static implicit operator string(PhoneNumber phone) => phone.Formatted;
}
