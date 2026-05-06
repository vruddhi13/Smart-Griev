namespace SmartGriev.DTOs.OfficerDTOs
{
    public class UpdateStatusDTO
    {
        public int ComplaintId { get; set; }
        public string Status { get; set; }
        public string? Remarks { get; set; }
    }
}

