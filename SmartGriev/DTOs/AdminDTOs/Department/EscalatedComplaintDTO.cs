namespace SmartGriev.DTOs.AdminDTOs.Department
{
    public class EscalatedComplaintDTO
    {
        public int ComplaintId { get; set; }
        public string ComplaintNumber { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string OfficerName { get; set; }
        public DateTime? SlaDueTime { get; set; }
        public DateTime EscalatedAt { get; set; }
        public string EscalationReason { get; set; }
    }

    public class EscalationActionDTO
    {
        public int ComplaintId { get; set; }

        // Resolve / Reassign / Comment
        public string ActionType { get; set; }
        public string Remarks { get; set; }
    }
}
