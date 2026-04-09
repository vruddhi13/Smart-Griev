namespace SmartGriev.DTOs.AdminDTOs
{
    public class SlaCreateDTO
    {
        public int DepartmentId { get; set; }
        public int CategoryId { get; set; }
        public string PriorityLevel { get; set; } = "";
        public int ResolutionHours { get; set; }
        public int EscalationHours { get; set; }
    }
}
