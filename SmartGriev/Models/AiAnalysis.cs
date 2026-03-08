using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class AiAnalysis
{
    public int AiId { get; set; }

    public int ComplaintId { get; set; }

    public string DetectedCategory { get; set; } = null!;

    public decimal ConfidenceScore { get; set; }

    public bool DuplicateFlag { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Complaint Complaint { get; set; } = null!;
}
