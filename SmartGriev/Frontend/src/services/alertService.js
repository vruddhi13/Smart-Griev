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