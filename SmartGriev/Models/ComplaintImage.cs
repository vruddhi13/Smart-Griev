using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class ComplaintImage
{
    public int ImageId { get; set; }

    public int ComplaintId { get; set; }

    public string ImageType { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public int? FileSizeKb { get; set; }

    public int UploadedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Complaint Complaint { get; set; } = null!;

    public virtual User UploadedByNavigation { get; set; } = null!;
}
