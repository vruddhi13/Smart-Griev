using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface ISlaRepository
    {
        Task<List<SlaMaster>> GetAllSla();
        Task<SlaMaster> AddSla(SlaCreateDTO dto);
        Task UpdateSla(int id, SlaUpdateDTO dto);
        Task DeleteSla(int id);
    }
}
