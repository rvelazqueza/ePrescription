using MediatR;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Pharmacies;

public class DeletePharmacyCommandHandler : IRequestHandler<DeletePharmacyCommand, bool>
{
    private readonly IRepository<Pharmacy> _pharmacyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeletePharmacyCommandHandler(
        IRepository<Pharmacy> pharmacyRepository,
        IUnitOfWork unitOfWork)
    {
        _pharmacyRepository = pharmacyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeletePharmacyCommand request, CancellationToken cancellationToken)
    {
        var pharmacy = await _pharmacyRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (pharmacy == null)
        {
            throw new KeyNotFoundException($"Pharmacy with ID {request.Id} not found");
        }

        _pharmacyRepository.Remove(pharmacy);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
