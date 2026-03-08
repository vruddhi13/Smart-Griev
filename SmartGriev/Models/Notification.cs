using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int UserId { get; set; }

    public int? ComplaintId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string NotificationType { get; set; } = null!;

    public bool IsRead { get; set; }

    public DateTime SentAt { get; set; }

    public virtual Complaint? Complaint { get; set; }

    public virtual User User { get; set; } = null!;
}
