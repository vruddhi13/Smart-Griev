using SmartGriev.Models;

namespace SmartGriev.DTOs.AdminDTOs
{
    public class EscalationDTO
    {
        public int ComplaintId { get; set; }

        public int EscalatedFrom { get; set; }

        public int EscalatedTo { get; set; }

        public string? Reason { get; set; }

        public int EscalationLevel { get; set; }
    }
}
