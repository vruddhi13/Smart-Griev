using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class Department
{
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ComplaintCategory> ComplaintCategories { get; set; } = new List<ComplaintCategory>();

    public virtual ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();

    public virtual ICollection<SlaMaster> SlaMasters { get; set; } = new List<SlaMaster>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
