using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class ComplaintStatusLog
{
    public int StatusLogId { get; set; }

    public int ComplaintId { get; set; }

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = null!;

    public int ChangedBy { get; set; }

    public string? Remarks { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual User ChangedByNavigation { get; set; } = null!;

    public virtual Complaint Complaint { get; set; } = null!;
}
