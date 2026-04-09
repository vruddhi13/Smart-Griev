namespace SmartGriev.DTOs.AdminDTOs
{
    public class UserRoleListDTO
    {
        public int UserId { get; set; }
        public string? Name { get; set; }        // ✅ match frontend
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public bool IsActive { get; set; }
    }
}
