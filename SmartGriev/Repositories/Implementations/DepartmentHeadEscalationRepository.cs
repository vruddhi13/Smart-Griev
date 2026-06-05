using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs.Department;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

namespace SmartGriev.Repositories.Implementations
{
    public class DepartmentHeadEscalationRepository
   : IDepartmentHeadEscalationRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public DepartmentHeadEscalationRepository(
            Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        public async Task<List<EscalatedComplaintDTO>>
            GetMyEscalations(int departmentHeadId)
        {
            return await _context.Complaints
                .Where(x =>
                    x.EscalatedTo == departmentHeadId)
                .Select(x => new EscalatedComplaintDTO
                {
                    ComplaintId = x.ComplaintId,
                    ComplaintNumber = x.ComplaintNumber,
                    Description = x.Description,
                    Status = x.Status,
                    OfficerName = x.AssignedToNavigation != null
                        ? x.AssignedToNavigation.FullName
                        : "",

                    SlaDueTime = x.SlaDueTime,

                    EscalationReason = x.EscalationLogs
                        .OrderByDescending(e => e.EscalatedAt)
                        .Select(e => e.Reason)
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<bool> EscalationAction(
            int departmentHeadId,
            EscalationActionDTO dto)
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(x =>
                    x.ComplaintId == dto.ComplaintId);

            if (complaint == null)
                return false;

            switch (dto.ActionType.ToLower())
            {
                case "comment":

                    _context.ComplaintStatusLogs.Add(
                        new ComplaintStatusLog
                        {
                            ComplaintId = dto.ComplaintId,
                            OldStatus = complaint.Status,
                            NewStatus = complaint.Status,
                            ChangedBy = departmentHeadId,
                            Remarks = dto.Remarks,
                            ChangedAt = DateTime.Now
                        });

                    break;

                case "close":

                    complaint.EscalatedTo = null;
                    complaint.UpdatedAt = DateTime.Now;

                    _context.ComplaintStatusLogs.Add(
                        new ComplaintStatusLog
                        {
                            ComplaintId = dto.ComplaintId,
                            OldStatus = complaint.Status,
                            NewStatus = complaint.Status,
                            ChangedBy = departmentHeadId,
                            Remarks =
                                "Escalation Closed : "
                                + dto.Remarks,
                            ChangedAt = DateTime.Now
                        });

                    break;

                default:
                    return false;
            }

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
