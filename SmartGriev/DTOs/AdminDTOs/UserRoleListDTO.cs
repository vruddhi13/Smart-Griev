namespace SmartGriev.DTOs.AdminDTOs
{
    public class UserRoleListDTO
    {
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? MobileNo { get; set; }
        public string? RoleName { get; set; }
        public bool IsActive { get; set; }
    }
}
