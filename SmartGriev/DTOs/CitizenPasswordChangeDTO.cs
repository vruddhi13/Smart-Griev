namespace SmartGriev.DTOs
{
    public class CitizenPasswordChangeDTO
    {
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
