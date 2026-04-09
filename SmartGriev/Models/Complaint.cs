using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class Complaint
{
    public int ComplaintId { get; set; }

    public string ComplaintNumber { get; set; } = null!;

    public int UserId { get; set; }

    public int DepartmentId { get; set; }

    public int CategoryId { get; set; }

    public string PriorityLevel { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Status { get; set; } = null!;

    public int? AssignedTo { get; set; }

    public DateTime? SlaDueTime { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public DateTime? ClosedAt { get; set; }

    public int ReopenCount { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AiAnalysis> AiAnalyses { get; set; } = new List<AiAnalysis>();

    public virtual User? AssignedToNavigation { get; set; }

    public virtual ComplaintCategory Category { get; set; } = null!;

    public virtual ICollection<CitizenFeedback> CitizenFeedbacks { get; set; } = new List<CitizenFeedback>();

    public virtual ICollection<ComplaintAssignment> ComplaintAssignments { get; set; } = new List<ComplaintAssignment>();

    public virtual ICollection<ComplaintImage> ComplaintImages { get; set; } = new List<ComplaintImage>();

    public virtual ICollection<ComplaintLocation> ComplaintLocations { get; set; } = new List<ComplaintLocation>();

    public virtual ICollection<ComplaintStatusLog> ComplaintStatusLogs { get; set; } = new List<ComplaintStatusLog>();

    public virtual Department Department { get; set; } = null!;

    public virtual ICollection<EscalationLog> EscalationLogs { get; set; } = new List<EscalationLog>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<SLA_Tracking> SlaTrackings { get; set; } = new List<SLA_Tracking>();
}
