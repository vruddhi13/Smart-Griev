using System;
using Microsoft.EntityFrameworkCore;
using SmartGriev.DTOs.AdminDTOs;
using SmartGriev.Models;
using SmartGriev.Repositories.Interfaces;

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
                    .ThenInclude(x => x.Role)

                .Include(x => x.EscalatedFromNavigation)
                    .ThenInclude(x => x.Department)

                .Include(x => x.EscalatedToNavigation)
                    .ThenInclude(x => x.Role)

                .Include(x => x.EscalatedToNavigation)
                    .ThenInclude(x => x.Department)

                .Select(x => new
                {
                    escalationId = x.EscalationId,

                    complaintId = x.ComplaintId,

                    complaintNumber =
                        x.Complaint.ComplaintNumber,

                    // =====================================
                    // ESCALATED FROM
                    // =====================================

                    escalatedFrom =
                        x.EscalatedFromNavigation.FullName,

                    escalatedFromId =
                        x.EscalatedFromNavigation.UserId,

                    escalatedFromRole =
                        x.EscalatedFromNavigation.Role.RoleName,

                    escalatedFromDepartment =
                        x.EscalatedFromNavigation.Department != null
                            ? x.EscalatedFromNavigation.Department.DepartmentName
                            : "System Admin",

                    // =====================================
                    // ESCALATED TO
                    // =====================================

                    escalatedTo =
                        x.EscalatedToNavigation.FullName,

                    escalatedToId =
                        x.EscalatedToNavigation.UserId,

                    escalatedToRole =
                        x.EscalatedToNavigation.Role.RoleName,

                    escalatedToDepartment =
                        x.EscalatedToNavigation.Department != null
                            ? x.EscalatedToNavigation.Department.DepartmentName
                            : "System Admin",

                    // =====================================

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
                    .ThenInclude(x => x.Role)

                .Include(x => x.EscalatedToNavigation)
                    .ThenInclude(x => x.Role)

                .Where(x => x.ComplaintId == complaintId)

                .Select(x => new
                {
                    escalationId = x.EscalationId,

                    escalatedFrom =
                        x.EscalatedFromNavigation.FullName,

                    escalatedFromRole =
                        x.EscalatedFromNavigation.Role.RoleName,

                    escalatedTo =
                        x.EscalatedToNavigation.FullName,

                    escalatedToRole =
                        x.EscalatedToNavigation.Role.RoleName,

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

            // =====================================
            // SAVE ESCALATION LOG
            // =====================================

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

            // =====================================
            // UPDATE COMPLAINT
            // =====================================

            complaint.Status = "Escalated";

            // Keep original officer assignment
            // Escalation goes to higher authority

            complaint.EscalatedTo = dto.EscalatedTo;
            var sla = await _context.SlaMasters
                .FirstOrDefaultAsync(x =>
                    x.DepartmentId == complaint.DepartmentId &&
                    x.CategoryId == complaint.CategoryId &&
                    x.PriorityLevel == complaint.PriorityLevel &&
                    x.IsActive);

            if (sla != null)
            {
                // Close current SLA tracking
                var activeTracking = await _context.SLA_Trackings
                    .Where(x =>
                        x.ComplaintId == complaint.ComplaintId &&
                        x.CompletedAt == null)
                    .OrderByDescending(x => x.TrackingId)
                    .FirstOrDefaultAsync();

                if (activeTracking != null)
                {
                    activeTracking.IsEscalated = true;
                    activeTracking.CompletedAt = DateTime.Now;
                }

                // Update complaint SLA due time
                complaint.SlaDueTime =
                    DateTime.Now.AddHours(sla.EscalationHours);

                // Create new SLA cycle
                _context.SLA_Trackings.Add(new SLA_Tracking
                {
                    ComplaintId = complaint.ComplaintId,
                    SlaId = sla.SlaId,
                    AssignedAt = DateTime.Now,
                    ResolutionDue = DateTime.Now.AddHours(sla.ResolutionHours),
                    EscalationDue = DateTime.Now.AddHours(sla.EscalationHours),
                    IsEscalated = false,
                    CompletedAt = null
                });
            }

            // =====================================
            // INSERT ASSIGNMENT HISTORY
            // =====================================

            var assignment = new ComplaintAssignment
            {
                ComplaintId = complaint.ComplaintId,

                AssignedTo = dto.EscalatedTo,

                AssignedBy = dto.EscalatedFrom,

                AssignmentStatus = "Escalated",

                Remarks = dto.Reason,

                AssignedAt = DateTime.Now
            };

            _context.ComplaintAssignments.Add(assignment);
            if (dto.EscalatedFrom <= 0 || dto.EscalatedTo <= 0)
            {
                throw new Exception("Invalid Escalation Users");
            }
            await _context.SaveChangesAsync();

            return "Complaint escalated successfully";
        }

        // =====================================================
        // AUTO ESCALATION
        // =====================================================
        public async Task<string> AutoEscalateComplaints()
        {
            int escalatedCount = 0;

            var overdueComplaints = await _context.SLA_Trackings
                .Include(x => x.Complaint)
                .Where(x =>
                    x.CompletedAt == null &&
                    x.IsEscalated == false &&
                    x.EscalationDue <= DateTime.Now)
                .ToListAsync();

            if (!overdueComplaints.Any())
                return "No complaints eligible for escalation";

            foreach (var tracking in overdueComplaints)
            {
                var complaint = tracking.Complaint;

                if (complaint == null)
                    continue;

                // Get current responsible user
                int currentUserId =
                    complaint.EscalatedTo ??
                    complaint.AssignedTo ?? 0;

                if (currentUserId == 0)
                    continue;

                var currentUser = await _context.Users
                    .Include(x => x.Role)
                    .FirstOrDefaultAsync(x =>
                        x.UserId == currentUserId);

                if (currentUser == null)
                    continue;

                User? nextUser = null;

                // Officer -> Department Head
                if (currentUser.Role?.RoleName == "Officer")
                {
                    nextUser = await _context.Users
                        .Include(x => x.Role)
                        .FirstOrDefaultAsync(x =>
                            x.DepartmentId == complaint.DepartmentId &&
                            x.Role.RoleName == "Department Head" &&
                            x.IsActive);
                }
                // Department Head -> Admin
                else if (currentUser.Role?.RoleName == "Department Head")
                {
                    nextUser = await _context.Users
                        .Include(x => x.Role)
                        .FirstOrDefaultAsync(x =>
                            x.Role.RoleName == "Admin" &&
                            x.IsActive);
                }
                else
                {
                    continue;
                }

                if (nextUser == null)
                    continue;
                var lastLevel = await _context.EscalationLogs
      .Where(x => x.ComplaintId == complaint.ComplaintId)
      .MaxAsync(x => (int?)x.EscalationLevel) ?? 0;

                // Save escalation log
                _context.EscalationLogs.Add(new EscalationLog
                {
                    ComplaintId = complaint.ComplaintId,
                    EscalatedFrom = currentUser.UserId,
                    EscalatedTo = nextUser.UserId,
                    EscalationLevel = lastLevel + 1,
                    Reason = "SLA Breach",
                    EscalatedAt = DateTime.Now
                });

                // Update complaint
                complaint.Status = "Escalated";
                complaint.EscalatedTo = nextUser.UserId;

                // Get SLA Master
                var sla = await _context.SlaMasters
                    .FirstOrDefaultAsync(x =>
                        x.DepartmentId == complaint.DepartmentId &&
                        x.CategoryId == complaint.CategoryId &&
                        x.PriorityLevel == complaint.PriorityLevel &&
                        x.IsActive);

                if (sla != null)
                {
                    // Update next SLA deadline
                    complaint.SlaDueTime =
                        DateTime.Now.AddHours(sla.EscalationHours);

                    // Close current SLA cycle
                    tracking.IsEscalated = true;
                    tracking.CompletedAt = DateTime.Now;

                    // Create new SLA cycle
                    _context.SLA_Trackings.Add(new SLA_Tracking
                    {
                        ComplaintId = complaint.ComplaintId,
                        SlaId = sla.SlaId,
                        AssignedAt = DateTime.Now,
                        ResolutionDue = DateTime.Now.AddHours(sla.ResolutionHours),
                        EscalationDue = DateTime.Now.AddHours(sla.EscalationHours),
                        IsEscalated = false,
                        CompletedAt = null
                    });
                }
                else
                {
                    tracking.IsEscalated = true;
                    tracking.CompletedAt = DateTime.Now;
                }

                // Assignment History
                _context.ComplaintAssignments.Add(new ComplaintAssignment
                {
                    ComplaintId = complaint.ComplaintId,
                    AssignedTo = nextUser.UserId,
                    AssignedBy = currentUser.UserId,
                    AssignmentStatus = "Escalated",
                    Remarks = "Auto Escalation - SLA Breach",
                    AssignedAt = DateTime.Now
                });

                escalatedCount++;
            }

            await _context.SaveChangesAsync();

            return $"{escalatedCount} complaint(s) escalated successfully";
        }

        public async Task<object> GetEscalationComplaints()
        {
            return await _context.Complaints

                .Include(x => x.User)

                .Include(x => x.Department)

                .Include(x => x.Category)

             .Include(x => x.AssignedToNavigation)
    .ThenInclude(x => x.Role)

.Include(x => x.EscalatedToNavigation)
    .ThenInclude(x => x.Role)

                .Select(x => new
                {
                    complaintId = x.ComplaintId,

                    complaintNumber = x.ComplaintNumber,
                    departmentId = x.DepartmentId,
                    userName =
                        x.User != null
                            ? x.User.FullName
                            : "-",

                    departmentName =
                        x.Department != null
                            ? x.Department.DepartmentName
                            : "-",

                    categoryName =
                        x.Category != null
                            ? x.Category.CategoryName
                            : "-",

                    location = x.ComplaintLocations,

                    assignedToId =
                        x.AssignedTo,

                    assignedToName =
                        x.AssignedToNavigation != null
                            ? x.AssignedToNavigation.FullName
                            : "Not Assigned",

                    assignedRole =
                        x.AssignedToNavigation != null &&
                        x.AssignedToNavigation.Role != null

                            ? x.AssignedToNavigation
                                .Role
                                .RoleName

                            : "-",
                    escalatedToId =
    x.EscalatedTo,

                    escalatedToName =
    x.EscalatedToNavigation != null
        ? x.EscalatedToNavigation.FullName
        : "Not Escalated",

                    escalatedRole =
    x.EscalatedToNavigation != null &&
    x.EscalatedToNavigation.Role != null

        ? x.EscalatedToNavigation
            .Role
            .RoleName

        : "-",

                    priorityLevel = x.PriorityLevel,

                    status = x.Status,

                    createdAt = x.CreatedAt,

                    escalationLevel =
                        _context.EscalationLogs

                            .Where(e =>
                                e.ComplaintId ==
                                x.ComplaintId)

                            .OrderByDescending(e =>
                                e.EscalationLevel)

                            .Select(e =>
                                e.EscalationLevel)

                            .FirstOrDefault()
                })

                .OrderByDescending(x => x.createdAt)

                .ToListAsync();
        }
    }
}