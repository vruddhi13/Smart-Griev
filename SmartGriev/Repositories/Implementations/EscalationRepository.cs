using System;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
namespace SmartGriev.Repositories.Implementations
{
    public class EscalationRepository : IEscalationRepository
    {
        private readonly Ict2smartGrievDbContext _context;

        public EscalationRepository(Ict2smartGrievDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET ALL ESCALATIONS
        // =====================================================
        public async Task<object> GetAllEscalations()
        {
            return await _context.EscalationLogs
                .Include(x => x.Complaint)
                .Include(x => x.EscalatedFromNavigation)
                .Include(x => x.EscalatedToNavigation)

                .Select(x => new
                {
                    escalationId = x.EscalationId,

                    complaintId = x.ComplaintId,

                    complaintNumber =
                        x.Complaint.ComplaintNumber,

                    escalatedFrom =
                        x.EscalatedFromNavigation.FullName,

                    escalatedTo =
                        x.EscalatedToNavigation.FullName,

                    reason = x.Reason,

                    escalationLevel =
                        x.EscalationLevel,

                    escalatedAt = x.EscalatedAt
                })

                .OrderByDescending(x => x.escalatedAt)

                .ToListAsync();
        }

        // =====================================================
        // GET ESCALATION BY COMPLAINT
        // =====================================================
        public async Task<object> GetEscalationByComplaint(
            int complaintId
        )
        {
            return await _context.EscalationLogs

                .Include(x => x.EscalatedFromNavigation)
                .Include(x => x.EscalatedToNavigation)

                .Where(x => x.ComplaintId == complaintId)

                .Select(x => new
                {
                    escalationId = x.EscalationId,

                    escalatedFrom =
                        x.EscalatedFromNavigation.FullName,

                    escalatedTo =
                        x.EscalatedToNavigation.FullName,

                    reason = x.Reason,

                    escalationLevel =
                        x.EscalationLevel,

                    escalatedAt = x.EscalatedAt
                })

                .ToListAsync();
        }

        // =====================================================
        // MANUAL ESCALATION
        // =====================================================
        public async Task<string> ManualEscalate(
            EscalationDTO dto
        )
        {
            var complaint = await _context.Complaints
                .FirstOrDefaultAsync(x =>
                    x.ComplaintId == dto.ComplaintId);

            if (complaint == null)
                throw new Exception("Complaint not found");

            var escalation = new EscalationLog
            {
                ComplaintId = dto.ComplaintId,

                EscalatedFrom = dto.EscalatedFrom,

                EscalatedTo = dto.EscalatedTo,

                Reason = dto.Reason,

                EscalationLevel = dto.EscalationLevel,

                EscalatedAt = DateTime.Now
            };

            _context.EscalationLogs.Add(escalation);

            complaint.Status = "Escalated";

            await _context.SaveChangesAsync();

            return "Complaint escalated successfully";
        }

        // =====================================================
        // AUTO ESCALATION
        // =====================================================
        public async Task<string> AutoEscalateComplaints()
        {
            var overdueComplaints =
                await _context.SLA_Trackings

                .Where(x =>
                    x.CompletedAt == null &&
                    x.IsEscalated == false &&
                    x.EscalationDue <= DateTime.Now
                )

                .ToListAsync();

            foreach (var tracking in overdueComplaints)
            {
                var complaint =
                    await _context.Complaints
                    .FirstOrDefaultAsync(x =>
                        x.ComplaintId ==
                        tracking.ComplaintId);

                if (complaint == null)
                    continue;

                // =====================================
                // FIND DEPARTMENT HEAD
                // =====================================

                var deptHead =
                    await _context.Users

                    .Include(x => x.Role)

                    .FirstOrDefaultAsync(x =>

                        x.DepartmentId ==
                        complaint.DepartmentId &&

                        x.Role != null &&

                        x.Role.RoleName ==
                        "DepartmentHead"
                    );

                if (deptHead == null)
                    continue;

                // =====================================
                // SAVE ESCALATION
                // =====================================

                _context.EscalationLogs.Add(
                    new EscalationLog
                    {
                        ComplaintId =
                            complaint.ComplaintId,

                        EscalatedFrom =
                            complaint.AssignedTo ?? 0,

                        EscalatedTo =
                            deptHead.UserId,

                        Reason =
                            "SLA Breach",

                        EscalationLevel = 1,

                        EscalatedAt =
                            DateTime.Now
                    });

                complaint.Status = "Escalated";

                tracking.IsEscalated = true;
            }

            await _context.SaveChangesAsync();

            return "Auto escalation completed";
        }
    }
}
