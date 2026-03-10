using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string MobileNo { get; set; } = null!;

    public string? PasswordHash { get; set; }

    public int RoleId { get; set; }

    public int? DepartmentId { get; set; }

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<CitizenFeedback> CitizenFeedbacks { get; set; } = new List<CitizenFeedback>();

    public virtual ICollection<Complaint> ComplaintAssignedToNavigations { get; set; } = new List<Complaint>();

    public virtual ICollection<ComplaintAssignment> ComplaintAssignmentAssignedByNavigations { get; set; } = new List<ComplaintAssignment>();

    public virtual ICollection<ComplaintAssignment> ComplaintAssignmentAssignedToNavigations { get; set; } = new List<ComplaintAssignment>();

    public virtual ICollection<ComplaintImage> ComplaintImages { get; set; } = new List<ComplaintImage>();

    public virtual ICollection<ComplaintStatusLog> ComplaintStatusLogs { get; set; } = new List<ComplaintStatusLog>();

    public virtual ICollection<Complaint> ComplaintUsers { get; set; } = new List<Complaint>();

    public virtual Department? Department { get; set; }

    public virtual ICollection<EscalationLog> EscalationLogEscalatedFromNavigations { get; set; } = new List<EscalationLog>();

    public virtual ICollection<EscalationLog> EscalationLogEscalatedToNavigations { get; set; } = new List<EscalationLog>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Role Role { get; set; } = null!;
}
