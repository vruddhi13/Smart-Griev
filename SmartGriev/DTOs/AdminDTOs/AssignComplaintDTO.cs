namespace SmartGriev.DTOs.AdminDTOs
{
    public class AssignComplaintDTO
    {
        public int ComplaintId { get; set; }
        public int OfficerId { get; set; }
        public int AdminId { get; set; }
        public string? Remarks { get; set; }

        public bool ForceReassign { get; set; }
    }
}
