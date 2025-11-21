using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Pharmacies;

public class UpdatePharmacyCommand : IRequest<PharmacyDto>
{
    public Guid Id { get; set; }
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
