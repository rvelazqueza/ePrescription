using System.Text.RegularExpressions;

namespace EPrescription.Domain.ValueObjects;

/// <summary>
/// Email value object - immutable email address with validation
/// </summary>
public sealed class Email : IEquatable<Email>
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));

        email = email.Trim().ToLowerInvariant();

        if (!EmailRegex.IsMatch(email))
            throw new ArgumentException($"Invalid email format: {email}", nameof(email));

        if (email.Length > 200)
            throw new ArgumentException("Email cannot exceed 200 characters", nameof(email));

        return new Email(email);
    }

    public static Email? CreateOrNull(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        return Create(email);
    }

    public override string ToString() => Value;

    public bool Equals(Email? other)
    {
        if (other is null) return false;
        return Value.Equals(other.Value, StringComparison.OrdinalIgnoreCase);
    }

    public override bool Equals(object? obj) => obj is Email email && Equals(email);

    public override int GetHashCode() => Value.GetHashCode(StringComparison.OrdinalIgnoreCase);

    public static bool operator ==(Email? left, Email? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(Email? left, Email? right) => !(left == right);

    public static implicit operator string(Email email) => email.Value;
}
