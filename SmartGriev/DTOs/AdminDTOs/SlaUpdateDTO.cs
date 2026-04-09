namespace SmartGriev.DTOs.AdminDTOs
{
    public class SlaUpdateDTO
    {
        public string PriorityLevel { get; set; } = "";
        public int ResolutionHours { get; set; }
        public int EscalationHours { get; set; }
    }
}
