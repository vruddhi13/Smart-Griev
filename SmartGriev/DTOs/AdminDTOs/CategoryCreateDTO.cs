namespace SmartGriev.DTOs.AdminDTOs
{
    public class CategoryCreateDTO
    {
        public string? CategoryName { get; set; }
        public int DepartmentId { get; set; }
        public string? Description { get; set; }
        public int SlaHours { get; set; }
    }
}
