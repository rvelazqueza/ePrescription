using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Pharmacies;

public class GetPharmacyQuery : IRequest<PharmacyDto?>
{
    public Guid Id { get; set; }
}
