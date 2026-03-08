using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class SlaMaster
{
    public int SlaId { get; set; }

    public int DepartmentId { get; set; }

    public int CategoryId { get; set; }

    public string PriorityLevel { get; set; } = null!;

    public int ResolutionHours { get; set; }

    public int EscalationHours { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ComplaintCategory Category { get; set; } = null!;

    public virtual Department Department { get; set; } = null!;
}
