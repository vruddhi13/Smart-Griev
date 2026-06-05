using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Repositories.Implementations
{
    public class SlaRepository : ISlaRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public SlaRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task<List<SlaMaster>> GetAllSla()
        {
            return await _context.SlaMasters.Where(s => s.IsActive == true).Include(s => s.Department).Include(s => s.Category).ToListAsync();
        }

        public async Task<SlaMaster> AddSla(SlaCreateDTO dto)
        {
            var sla = new SlaMaster
            {
                DepartmentId = dto.DepartmentId,
                CategoryId = dto.CategoryId,
                PriorityLevel = dto.PriorityLevel,
                ResolutionHours = dto.ResolutionHours,
                EscalationHours = dto.EscalationHours,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.SlaMasters.Add(sla);
            await _context.SaveChangesAsync();

            return sla;
        }

        public async Task UpdateSla(int id, SlaUpdateDTO dto)
        {
            var sla = await _context.SlaMasters.FindAsync(id);

            if (sla == null) return;

            sla.DepartmentId = dto.DepartmentId;
            sla.CategoryId = dto.CategoryId;

            sla.PriorityLevel = dto.PriorityLevel;
            sla.ResolutionHours = dto.ResolutionHours;
            sla.EscalationHours = dto.EscalationHours;

            sla.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteSla(int id)
        {
            var sla = await _context.SlaMasters.FindAsync(id);

            if (sla == null)
                throw new Exception("SLA not found");

            try
            {
                sla.IsActive = false;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new Exception("SLA cannot be deleted because it is used in other records.");
            }
        }

        public async Task<SlaMaster?> GetSlaById(int id)
        {
            return await _context.SlaMasters
                .FirstOrDefaultAsync(s => s.SlaId == id);
        }
    }
}
