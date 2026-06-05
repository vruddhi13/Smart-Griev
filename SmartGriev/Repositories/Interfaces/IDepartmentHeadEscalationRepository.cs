using SmartGriev.DTOs.AdminDTOs.Department;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IDepartmentHeadEscalationRepository
    {
        Task<List<EscalatedComplaintDTO>> GetMyEscalations(int departmentHeadId);

        Task<bool> EscalationAction(
            int departmentHeadId,
            EscalationActionDTO dto);
    }
}
