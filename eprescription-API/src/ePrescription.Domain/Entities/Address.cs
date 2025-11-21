namespace EPrescription.Domain.Entities;

/// <summary>
/// Address entity - shared by multiple entities
/// Maps to ADDRESSES table in Oracle
/// </summary>
public class Address : BaseEntity
{
    public string StreetAddress { get; private set; } = string.Empty;
    public string City { get; private set; } = string.Empty;
    public string StateProvince { get; private set; } = string.Empty;
    public string? PostalCode { get; private set; }
    public string Country { get; private set; } = "Costa Rica";
    public decimal? Latitude { get; private set; }
    public decimal? Longitude { get; private set; }

    private Address() { } // EF Core

    public Address(
        string streetAddress,
        string city,
        string stateProvince,
        string? postalCode = null,
        string country = "Costa Rica",
        decimal? latitude = null,
        decimal? longitude = null)
    {
        StreetAddress = streetAddress;
        City = city;
        StateProvince = stateProvince;
        PostalCode = postalCode;
        Country = country;
        Latitude = latitude;
        Longitude = longitude;
    }

    public void UpdateAddress(string streetAddress, string city, string stateProvince, string? postalCode = null)
    {
        StreetAddress = streetAddress;
        City = city;
        StateProvince = stateProvince;
        PostalCode = postalCode;
        UpdateTimestamp();
    }

    public void UpdateCoordinates(decimal latitude, decimal longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
        UpdateTimestamp();
    }
}
