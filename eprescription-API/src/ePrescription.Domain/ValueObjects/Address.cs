namespace EPrescription.Domain.ValueObjects;

/// <summary>
/// Value Object representing a physical address in Costa Rica
/// Immutable and validated according to Costa Rican address standards
/// Maps to ADDRESSES table in database
/// </summary>
public sealed class Address : IEquatable<Address>
{
    public string StreetAddress { get; }
    public string City { get; }
    public string StateProvince { get; }
    public string? PostalCode { get; }
    public string Country { get; }
    public decimal? Latitude { get; }
    public decimal? Longitude { get; }

    private Address(
        string streetAddress,
        string city,
        string stateProvince,
        string? postalCode,
        string country,
        decimal? latitude,
        decimal? longitude)
    {
        StreetAddress = streetAddress;
        City = city;
        StateProvince = stateProvince;
        PostalCode = postalCode;
        Country = country;
        Latitude = latitude;
        Longitude = longitude;
    }

    /// <summary>
    /// Creates a new Address with validation
    /// </summary>
    public static Address Create(
        string streetAddress,
        string city,
        string stateProvince,
        string? postalCode = null,
        string country = "Costa Rica",
        decimal? latitude = null,
        decimal? longitude = null)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(streetAddress))
            throw new ArgumentException("Street address cannot be empty", nameof(streetAddress));

        if (streetAddress.Length > 200)
            throw new ArgumentException("Street address cannot exceed 200 characters", nameof(streetAddress));

        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City cannot be empty", nameof(city));

        if (city.Length > 100)
            throw new ArgumentException("City cannot exceed 100 characters", nameof(city));

        if (string.IsNullOrWhiteSpace(stateProvince))
            throw new ArgumentException("State/Province cannot be empty", nameof(stateProvince));

        if (stateProvince.Length > 100)
            throw new ArgumentException("State/Province cannot exceed 100 characters", nameof(stateProvince));

        if (string.IsNullOrWhiteSpace(country))
            throw new ArgumentException("Country cannot be empty", nameof(country));

        if (country.Length > 100)
            throw new ArgumentException("Country cannot exceed 100 characters", nameof(country));

        // Validate postal code if provided
        if (!string.IsNullOrWhiteSpace(postalCode))
        {
            if (postalCode.Length > 20)
                throw new ArgumentException("Postal code cannot exceed 20 characters", nameof(postalCode));

            // Costa Rica postal codes are 5 digits (e.g., 10101)
            if (country == "Costa Rica" && !System.Text.RegularExpressions.Regex.IsMatch(postalCode, @"^\d{5}$"))
                throw new ArgumentException("Costa Rica postal code must be 5 digits", nameof(postalCode));
        }

        // Validate GPS coordinates if provided
        if (latitude.HasValue)
        {
            if (latitude.Value < -90 || latitude.Value > 90)
                throw new ArgumentException("Latitude must be between -90 and 90", nameof(latitude));
        }

        if (longitude.HasValue)
        {
            if (longitude.Value < -180 || longitude.Value > 180)
                throw new ArgumentException("Longitude must be between -180 and 180", nameof(longitude));
        }

        // Costa Rica GPS validation (approximate bounds)
        if (country == "Costa Rica" && latitude.HasValue && longitude.HasValue)
        {
            // Costa Rica is approximately between 8°-11°N and 82°-86°W
            if (latitude.Value < 8 || latitude.Value > 11.5m)
                throw new ArgumentException("Latitude is outside Costa Rica bounds (8° to 11.5° N)", nameof(latitude));

            if (longitude.Value < -86 || longitude.Value > -82)
                throw new ArgumentException("Longitude is outside Costa Rica bounds (82° to 86° W)", nameof(longitude));
        }

        return new Address(
            streetAddress.Trim(),
            city.Trim(),
            stateProvince.Trim(),
            postalCode?.Trim(),
            country.Trim(),
            latitude,
            longitude);
    }

    /// <summary>
    /// Creates an Address for Costa Rica with common provinces
    /// </summary>
    public static Address CreateCostaRica(
        string streetAddress,
        string city,
        CostaRicaProvince province,
        string? postalCode = null,
        decimal? latitude = null,
        decimal? longitude = null)
    {
        return Create(
            streetAddress,
            city,
            province.ToString(),
            postalCode,
            "Costa Rica",
            latitude,
            longitude);
    }

    /// <summary>
    /// Returns the full address as a formatted string
    /// </summary>
    public string GetFullAddress()
    {
        var parts = new List<string>
        {
            StreetAddress,
            City,
            StateProvince
        };

        if (!string.IsNullOrWhiteSpace(PostalCode))
            parts.Add(PostalCode);

        parts.Add(Country);

        return string.Join(", ", parts);
    }

    /// <summary>
    /// Returns true if GPS coordinates are available
    /// </summary>
    public bool HasGpsCoordinates() => Latitude.HasValue && Longitude.HasValue;

    // Equality implementation for value object
    public bool Equals(Address? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;

        return StreetAddress == other.StreetAddress &&
               City == other.City &&
               StateProvince == other.StateProvince &&
               PostalCode == other.PostalCode &&
               Country == other.Country &&
               Latitude == other.Latitude &&
               Longitude == other.Longitude;
    }

    public override bool Equals(object? obj) => Equals(obj as Address);

    public override int GetHashCode()
    {
        return HashCode.Combine(
            StreetAddress,
            City,
            StateProvince,
            PostalCode,
            Country,
            Latitude,
            Longitude);
    }

    public static bool operator ==(Address? left, Address? right)
    {
        if (left is null) return right is null;
        return left.Equals(right);
    }

    public static bool operator !=(Address? left, Address? right) => !(left == right);

    public override string ToString() => GetFullAddress();
}

/// <summary>
/// Costa Rica provinces for type-safe address creation
/// </summary>
public enum CostaRicaProvince
{
    SanJosé,
    Alajuela,
    Cartago,
    Heredia,
    Guanacaste,
    Puntarenas,
    Limón
}
