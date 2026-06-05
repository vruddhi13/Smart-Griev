using SmartGriev.Models;
using Microsoft.EntityFrameworkCore;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Repositories.Implementations
{
    public class AuditRepository: IAuditRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public AuditRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task AddLog(AuditLog log)
        {
            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
        }

        public async Task<List<AuditLog>> GetLogs()
        {
            return await _context.AuditLogs
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }
    }
}
