namespace SmartGriev.DTOs.AdminDTOs.Department
{
    public class DepartmentResponseDTO
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
