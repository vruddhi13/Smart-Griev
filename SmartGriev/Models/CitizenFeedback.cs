using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class CitizenFeedback
{
    public int FeedbackId { get; set; }

    public int ComplaintId { get; set; }

    public int CitizenId { get; set; }

    public int Rating { get; set; }

    public string? Comments { get; set; }

    public bool IsSatisfied { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User Citizen { get; set; } = null!;

    public virtual Complaint Complaint { get; set; } = null!;
}
