using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class EscalationLog
{
    public int EscalationId { get; set; }

    public int ComplaintId { get; set; }

    public int EscalatedFrom { get; set; }

    public int EscalatedTo { get; set; }

    public string? Reason { get; set; }

    public int EscalationLevel { get; set; }

    public DateTime EscalatedAt { get; set; }

    public virtual Complaint Complaint { get; set; } = null!;

    public virtual User EscalatedFromNavigation { get; set; } = null!;

    public virtual User EscalatedToNavigation { get; set; } = null!;
}
