using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class Permission
{
    public int PermissionId { get; set; }

    public string PermissionName { get; set; } = null!;

    public string? ModuleName { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
