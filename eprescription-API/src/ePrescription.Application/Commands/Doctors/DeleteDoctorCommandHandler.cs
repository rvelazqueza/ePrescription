using MediatR;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Doctors;

public class DeleteDoctorCommandHandler : IRequestHandler<DeleteDoctorCommand, bool>
{
    private readonly IRepository<Doctor> _doctorRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDoctorCommandHandler(
        IRepository<Doctor> doctorRepository,
        IUnitOfWork unitOfWork)
    {
        _doctorRepository = doctorRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteDoctorCommand request, CancellationToken cancellationToken)
    {
        var doctor = await _doctorRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (doctor == null)
        {
            throw new KeyNotFoundException($"Doctor with ID {request.Id} not found");
        }

        _doctorRepository.Remove(doctor);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
