using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Patients;

public class GetPatientQueryHandler : IRequestHandler<GetPatientQuery, PatientDto?>
{
    private readonly IRepository<Patient> _patientRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetPatientQueryHandler> _logger;

    public GetPatientQueryHandler(
        IRepository<Patient> patientRepository,
        IMapper mapper,
        ILogger<GetPatientQueryHandler> logger)
    {
        _patientRepository = patientRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PatientDto?> Handle(GetPatientQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Getting patient {PatientId}", request.PatientId);

            var patient = await _patientRepository.GetByIdAsync(request.PatientId, cancellationToken);

            if (patient == null)
            {
                _logger.LogWarning("Patient {PatientId} not found", request.PatientId);
                return null;
            }

            var result = _mapper.Map<PatientDto>(patient);

            _logger.LogInformation("Successfully retrieved patient {PatientName}", $"{patient.FirstName} {patient.LastName}");

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting patient {PatientId}", request.PatientId);
            throw;
        }
    }
}
