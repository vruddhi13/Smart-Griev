using System;

namespace SmartGriev.Models
{
    public class SLA_Tracking
    {
        public int TrackingId { get; set; }
        public int ComplaintId { get; set; }
        public int SlaId { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.Now;
        public DateTime ResolutionDue { get; set; }
        public DateTime? EscalationDue { get; set; }
        public bool IsEscalated { get; set; } = false;
        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        public Complaint? Complaint { get; set; }
        public SlaMaster? Sla { get; set; }
        
    }
}
