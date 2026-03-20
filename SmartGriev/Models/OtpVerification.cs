using System;
using System.Collections.Generic;

namespace SmartGriev.Models;

public partial class OtpVerification
{
    public int OtpId { get; set; }

    public string MobileNo { get; set; } = null!;

    public string OtpCode { get; set; } = null!;

    public DateTime ExpiryTime { get; set; }

    public bool IsVerified { get; set; } = false;

    public int AttemptCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; }

    public DateTime? VerifiedAt { get; set; }
}
