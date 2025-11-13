using System.Text.RegularExpressions;

namespace EPrescription.Domain.ValueObjects;

/// <summary>
/// MedicalLicense value object - immutable medical license number
/// Costa Rica format: typically numeric or alphanumeric
/// </summary>
public sealed class MedicalLicense : IEquatable<MedicalLicense>
{
    private static readonly Regex LicenseRegex = new(
        @"^[A-Z0-9]{4,20}$",
        RegexOptions.Compiled);

    public string Value { get; }

    private MedicalLicense(string value)
    {
        Value = value;
    }

    public static MedicalLicense Create(string license)
    {
        if (string.IsNullOrWhiteSpace(license))
            throw new ArgumentException("Medical license cannot be empty", nameof(license));

        license = license.Trim().ToUpperInvariant().Replace("-", "").Replace(" ", "");

        if (!LicenseRegex.IsMatch(license))
            throw new ArgumentException(
                $"Invalid medical license format: {license}. Must be 4-20 alphanumeric characters",
                nameof(license));

        if (license.Length < 4)
            throw new ArgumentException("Medical license must be at least 4 characters", nameof(license));

        if (license.Length > 50)
            throw new ArgumentException("Medical license cannot exceed 50 characters", nameof(license));

        return new MedicalLicense(license);
    }

    public static MedicalLicense? CreateOrNull(string? license)
    {
        if (string.IsNullOrWhiteSpace(license))
            return null;

        return Create(license);
    }

    public override string ToString() => Value;

    public bool Equals(MedicalLicense? other)
    {
        if (other is null) return false;
        return Value == other.Value;
    }

    public override bool Equals(object? obj) => obj is MedicalLicense license && Equals(license);

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(MedicalLicense? left, MedicalLicense? right) =>
        left?.Equals(right) ?? right is null;

    public static bool operator !=(MedicalLicense? left, MedicalLicense? right) => !(left == right);

    public static implicit operator string(MedicalLicense license) => license.Value;
}
