namespace SmartGriev.DTOs
{
    public class FeedbackDTO
    {
        public int ComplaintId { get; set; }

        public int CitizenId { get; set; }

        public int Rating { get; set; }

        public string? Comments { get; set; }

        public bool IsSatisfied { get; set; }
    }
}
