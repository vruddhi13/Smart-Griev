using SmartGriev.DTOs.AdminDTOs;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IEscalationRepository
    {
        Task<object> GetAllEscalations();

        Task<object> GetEscalationByComplaint(int complaintId);

        Task<string> ManualEscalate(EscalationDTO dto);

        Task<string> AutoEscalateComplaints();

        Task<object> GetEscalationComplaints();

    }
}
