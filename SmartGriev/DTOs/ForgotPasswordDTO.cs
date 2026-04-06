namespace SmartGriev.DTOs
{
    public class ForgotPasswordDTO
    {
        public string MobileNo { get; set; }
        public string? Otp { get; set; }
        public string? Purpose { get; set; }
        public string? NewPassword { get; set; }
    }
}
