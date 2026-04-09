using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class ComplaintCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public int DepartmentId { get; set; }

    public string? Description { get; set; }

    //public int SlaHours { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();

    public virtual Department Department { get; set; } = null!;

    public virtual ICollection<SlaMaster> SlaMasters { get; set; } = new List<SlaMaster>();
}
