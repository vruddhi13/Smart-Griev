namespace SmartGriev.DTOs
{
    public class ComplaintDTO
    {
        public int UserId { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? PriorityLevel { get; set; }

        public string? Address { get; set; }

        public IFormFile? Image { get; set; }
    }
}
