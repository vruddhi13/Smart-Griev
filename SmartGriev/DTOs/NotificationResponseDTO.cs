namespace SmartGriev.DTOs
{
    public class NotificationResponseDTO
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string NotificationType { get; set; }
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; }

        // Complaint Info
        public string ComplaintCategory { get; set; }

        // Feedback Info
        public int? Rating { get; set; }
        public bool? IsSatisfied { get; set; }
        public string Comments { get; set; }
    }
}
