import Swal from "sweetalert2";

// ❌ Error Alert
export const showError = (message) => {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
    });
};

// ✅ Success Toast (Top Right)
export const showSuccessToast = (message) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });
};

// ❓ Confirm Delete (SweetAlert)
export const confirmDelete = async () => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EE5D50",
        cancelButtonColor: "#A3AED0",
        confirmButtonText: "Yes, delete it!"
    });

    return result.isConfirmed;
};