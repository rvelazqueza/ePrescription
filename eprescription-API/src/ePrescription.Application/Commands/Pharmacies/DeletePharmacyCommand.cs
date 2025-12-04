using MediatR;

namespace EPrescription.Application.Commands.Pharmacies;

public class DeletePharmacyCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
