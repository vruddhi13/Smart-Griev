using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class ComplaintLocation
{
    public int LocationId { get; set; }

    public int ComplaintId { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string? Address { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Complaint Complaint { get; set; } = null!;
}
