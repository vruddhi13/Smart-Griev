using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class AuditLog
{
    public long AuditId { get; set; }

    public int UserId { get; set; }

    public string ActionType { get; set; } = null!;

    public string EntityName { get; set; } = null!;

    public int? EntityId { get; set; }

    public string? OldData { get; set; }

    public string? NewData { get; set; }

    public string? Description { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
