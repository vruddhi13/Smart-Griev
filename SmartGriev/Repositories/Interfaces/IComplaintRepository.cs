using SmartGriev.DTOs;
using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IComplaintRepository
    {
        Task<object> SubmitComplaint(ComplaintDTO dto);
        Task<List<Complaint>> GetComplaints();
    }
}
