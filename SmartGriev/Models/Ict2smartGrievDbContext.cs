using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SmartGriev.Models;

public partial class Ict2smartGrievDbContext : DbContext
{
    public Ict2smartGrievDbContext()
    {
    }

    public Ict2smartGrievDbContext(DbContextOptions<Ict2smartGrievDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AiAnalysis> AiAnalyses { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<CitizenFeedback> CitizenFeedbacks { get; set; }

    public virtual DbSet<Complaint> Complaints { get; set; }

    public virtual DbSet<ComplaintAssignment> ComplaintAssignments { get; set; }

    public virtual DbSet<ComplaintCategory> ComplaintCategories { get; set; }

    public virtual DbSet<ComplaintImage> ComplaintImages { get; set; }

    public virtual DbSet<ComplaintLocation> ComplaintLocations { get; set; }

    public virtual DbSet<ComplaintStatusLog> ComplaintStatusLogs { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<EscalationLog> EscalationLogs { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<OtpVerification> OtpVerifications { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<SlaMaster> SlaMasters { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=smartGrievConnectionString");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AiAnalysis>(entity =>
        {
            entity.HasKey(e => e.AiId).HasName("PK__AI_analy__0372DAEE1F422C68");

            entity.ToTable("AI_analysis");

            entity.Property(e => e.AiId).HasColumnName("ai_id");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.ConfidenceScore)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("confidence_score");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DetectedCategory)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("detected_category");
            entity.Property(e => e.DuplicateFlag).HasColumnName("duplicate_flag");

            entity.HasOne(d => d.Complaint).WithMany(p => p.AiAnalyses)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ai_analysis_complaint");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__Audit_lo__5AF33E33B000EA09");

            entity.ToTable("Audit_logs");

            entity.Property(e => e.AuditId).HasColumnName("audit_id");
            entity.Property(e => e.ActionType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("action_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.EntityId).HasColumnName("entity_id");
            entity.Property(e => e.EntityName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("entity_name");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.NewData).HasColumnName("new_data");
            entity.Property(e => e.OldData).HasColumnName("old_data");
            entity.Property(e => e.UserAgent)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("user_agent");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_auditlogs_user");
        });

        modelBuilder.Entity<CitizenFeedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Citizen___7A6B2B8C643D4F8D");

            entity.ToTable("Citizen_feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.CitizenId).HasColumnName("citizen_id");
            entity.Property(e => e.Comments)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("comments");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.IsSatisfied).HasColumnName("is_satisfied");
            entity.Property(e => e.Rating).HasColumnName("rating");

            entity.HasOne(d => d.Citizen).WithMany(p => p.CitizenFeedbacks)
                .HasForeignKey(d => d.CitizenId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_feedback_user");

            entity.HasOne(d => d.Complaint).WithMany(p => p.CitizenFeedbacks)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_feedback_complaint");
        });

        modelBuilder.Entity<Complaint>(entity =>
        {
            entity.HasKey(e => e.ComplaintId).HasName("PK__Complain__A771F61C25C754C6");

            entity.HasIndex(e => e.ComplaintNumber, "UQ__Complain__C9AE2C6D07CE4573").IsUnique();

            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.AssignedTo).HasColumnName("assigned_to");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.ClosedAt).HasColumnName("closed_at");
            entity.Property(e => e.ComplaintNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("complaint_number");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.PriorityLevel)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Medium")
                .HasColumnName("priority_level");
            entity.Property(e => e.ReopenCount).HasColumnName("reopen_count");
            entity.Property(e => e.ResolvedAt).HasColumnName("resolved_at");
            entity.Property(e => e.SlaDueTime).HasColumnName("sla_due_time");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("Submitted")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.AssignedToNavigation).WithMany(p => p.ComplaintAssignedToNavigations)
                .HasForeignKey(d => d.AssignedTo)
                .HasConstraintName("FK_complaint_assigned_to");

            entity.HasOne(d => d.Category).WithMany(p => p.Complaints)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_category");

            entity.HasOne(d => d.Department).WithMany(p => p.Complaints)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_department");

            entity.HasOne(d => d.User).WithMany(p => p.ComplaintUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_user");
        });

        modelBuilder.Entity<ComplaintAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__Complain__DA89181424979E73");

            entity.ToTable("Complaint_assignment");

            entity.Property(e => e.AssignmentId).HasColumnName("assignment_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("assigned_at");
            entity.Property(e => e.AssignedBy).HasColumnName("assigned_by");
            entity.Property(e => e.AssignedTo).HasColumnName("assigned_to");
            entity.Property(e => e.AssignmentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Assigned")
                .HasColumnName("assignment_status");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("remarks");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.ComplaintAssignmentAssignedByNavigations)
                .HasForeignKey(d => d.AssignedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_assignment_assigned_by");

            entity.HasOne(d => d.AssignedToNavigation).WithMany(p => p.ComplaintAssignmentAssignedToNavigations)
                .HasForeignKey(d => d.AssignedTo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_assignment_assigned_to");

            entity.HasOne(d => d.Complaint).WithMany(p => p.ComplaintAssignments)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_assignment_complaint");
        });

        modelBuilder.Entity<ComplaintCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Complain__D54EE9B42F868D83");

            entity.ToTable("Complaint_categories");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("category_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.SlaHours)
                .HasDefaultValue(48)
                .HasColumnName("sla_hours");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Department).WithMany(p => p.ComplaintCategories)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_category_department");
        });

        modelBuilder.Entity<ComplaintImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__Complain__DC9AC955A1E5FD0D");

            entity.ToTable("Complaint_images");

            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("file_name");
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("file_path");
            entity.Property(e => e.FileSizeKb).HasColumnName("file_size_kb");
            entity.Property(e => e.ImageType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("image_type");
            entity.Property(e => e.UploadedBy).HasColumnName("uploaded_by");

            entity.HasOne(d => d.Complaint).WithMany(p => p.ComplaintImages)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_images_complaint");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.ComplaintImages)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_images_user");
        });

        modelBuilder.Entity<ComplaintLocation>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PK__Complain__771831EA4CCF9FDD");

            entity.ToTable("Complaint_location");

            entity.Property(e => e.LocationId).HasColumnName("location_id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("address");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Latitude)
                .HasColumnType("decimal(10, 7)")
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasColumnType("decimal(10, 7)")
                .HasColumnName("longitude");

            entity.HasOne(d => d.Complaint).WithMany(p => p.ComplaintLocations)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_complaint_location_complaint");
        });

        modelBuilder.Entity<ComplaintStatusLog>(entity =>
        {
            entity.HasKey(e => e.StatusLogId).HasName("PK__Complain__9523D868A9286EE5");

            entity.ToTable("Complaint_status_log");

            entity.Property(e => e.StatusLogId).HasColumnName("status_log_id");
            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("changed_at");
            entity.Property(e => e.ChangedBy).HasColumnName("changed_by");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.NewStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("new_status");
            entity.Property(e => e.OldStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("old_status");
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("remarks");

            entity.HasOne(d => d.ChangedByNavigation).WithMany(p => p.ComplaintStatusLogs)
                .HasForeignKey(d => d.ChangedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_statuslog_user");

            entity.HasOne(d => d.Complaint).WithMany(p => p.ComplaintStatusLogs)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_statuslog_complaint");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DepartmentId).HasName("PK__Departme__C22324225C552AF3");

            entity.HasIndex(e => e.DepartmentName, "UQ__Departme__226ED157093F7A5C").IsUnique();

            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("department_name");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
        });

        modelBuilder.Entity<EscalationLog>(entity =>
        {
            entity.HasKey(e => e.EscalationId).HasName("PK__Escalati__9E0A567B606AEDA4");

            entity.ToTable("Escalation_log");

            entity.Property(e => e.EscalationId).HasColumnName("escalation_id");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.EscalatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("escalated_at");
            entity.Property(e => e.EscalatedFrom).HasColumnName("escalated_from");
            entity.Property(e => e.EscalatedTo).HasColumnName("escalated_to");
            entity.Property(e => e.EscalationLevel).HasColumnName("escalation_level");
            entity.Property(e => e.Reason)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("reason");

            entity.HasOne(d => d.Complaint).WithMany(p => p.EscalationLogs)
                .HasForeignKey(d => d.ComplaintId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_escalation_complaint");

            entity.HasOne(d => d.EscalatedFromNavigation).WithMany(p => p.EscalationLogEscalatedFromNavigations)
                .HasForeignKey(d => d.EscalatedFrom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_escalation_from_user");

            entity.HasOne(d => d.EscalatedToNavigation).WithMany(p => p.EscalationLogEscalatedToNavigations)
                .HasForeignKey(d => d.EscalatedTo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_escalation_to_user");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F8BC79B4D");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.ComplaintId).HasColumnName("complaint_id");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.Message)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("message");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("notification_type");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("sent_at");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Complaint).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ComplaintId)
                .HasConstraintName("FK_notification_complaint");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_notification_user");
        });

        modelBuilder.Entity<OtpVerification>(entity =>
        {
            entity.HasKey(e => e.OtpId).HasName("PK__OTP_veri__AEE354354261F3FC");

            entity.ToTable("OTP_verification");

            entity.Property(e => e.OtpId).HasColumnName("otp_id");
            entity.Property(e => e.AttemptCount).HasColumnName("attempt_count");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpiryTime).HasColumnName("expiry_time");
            entity.Property(e => e.IsVerified).HasColumnName("is_verified");
            entity.Property(e => e.MobileNo)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("mobile_no");
            entity.Property(e => e.OtpCode)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("otp_code");
            entity.Property(e => e.VerifiedAt).HasColumnName("verified_at");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__Permissi__E5331AFA0C3D991F");

            entity.HasIndex(e => e.PermissionName, "UQ__Permissi__81C0F5A241FB63E0").IsUnique();

            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.ModuleName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("module_name");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("permission_name");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__760965CC5D47A4BC");

            entity.HasIndex(e => e.RoleName, "UQ__Roles__783254B10BE0BF19").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.RolePermissionId).HasName("PK__Role_per__B1E85A106E4A653C");

            entity.ToTable("Role_permissions");

            entity.Property(e => e.RolePermissionId).HasColumnName("role_permission_id");
            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_role_permissions_permissions");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_role_permissions_roles");
        });

        modelBuilder.Entity<SlaMaster>(entity =>
        {
            entity.HasKey(e => e.SlaId).HasName("PK__SLA_mast__F25460DE46D2274D");

            entity.ToTable("SLA_master");

            entity.Property(e => e.SlaId).HasColumnName("sla_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.EscalationHours).HasColumnName("escalation_hours");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.PriorityLevel)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("priority_level");
            entity.Property(e => e.ResolutionHours).HasColumnName("resolution_hours");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Category).WithMany(p => p.SlaMasters)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_sla_category");

            entity.HasOne(d => d.Department).WithMany(p => p.SlaMasters)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_sla_department");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F96209563");

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E61642DF662B7").IsUnique();

            entity.HasIndex(e => e.MobileNo, "UQ__Users__D7B19EFA5C904C81").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("full_name");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.IsDeleted).HasColumnName("is_deleted");
            entity.Property(e => e.MobileNo)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("mobile_no");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Department).WithMany(p => p.Users)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("FK_users_department");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_users_role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
