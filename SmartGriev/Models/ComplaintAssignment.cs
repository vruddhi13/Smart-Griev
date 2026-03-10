using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class ComplaintAssignment
{
    public int AssignmentId { get; set; }

    public int ComplaintId { get; set; }

    public int AssignedTo { get; set; }

    public int AssignedBy { get; set; }

    public string AssignmentStatus { get; set; } = null!;

    public string? Remarks { get; set; }

    public DateTime AssignedAt { get; set; }

    public virtual User AssignedByNavigation { get; set; } = null!;

    public virtual User AssignedToNavigation { get; set; } = null!;

    public virtual Complaint Complaint { get; set; } = null!;
}
