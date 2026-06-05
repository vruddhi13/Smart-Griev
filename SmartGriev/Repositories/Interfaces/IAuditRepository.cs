using SmartGriev.Models;

namespace SmartGriev.Repositories.Interfaces
{
    public interface IAuditRepository
    {
        Task AddLog(AuditLog log);

        Task<List<AuditLog>> GetLogs();
    }
}
