using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Prescriptions;

public class DuplicatePrescriptionCommandHandler : IRequestHandler<DuplicatePrescriptionCommand, PrescriptionListDto>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<DuplicatePrescriptionCommandHandler> _logger;

    public DuplicatePrescriptionCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<DuplicatePrescriptionCommandHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionListDto> Handle(DuplicatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Duplicating prescription {PrescriptionId}", request.PrescriptionId);

            var duplicatedPrescription = await _prescriptionRepository.DuplicatePrescriptionAsync(
                request.PrescriptionId, 
                cancellationToken);

            if (duplicatedPrescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found for duplication", request.PrescriptionId);
                throw new KeyNotFoundException($"Prescription with ID {request.PrescriptionId} not found");
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Prescription {PrescriptionNumber} duplicated successfully as {NewPrescriptionNumber}", 
                request.PrescriptionId, duplicatedPrescription.PrescriptionNumber);

            return _mapper.Map<PrescriptionListDto>(duplicatedPrescription);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error duplicating prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
