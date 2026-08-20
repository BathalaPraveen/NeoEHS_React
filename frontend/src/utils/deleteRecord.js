// src/utils/deleteRecord.js
import api from "../config/axios";
import Swal from "sweetalert2";

const getAuthToken = () =>
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

// =========================================================
// confirmAndDelete — the ONE delete flow every list page reuses:
// confirm -> DELETE request (backend performs the soft delete) -> success/error alert.
// Returns true when the record was deleted, so the caller knows to refresh its list.
// =========================================================
export const confirmAndDelete = async ({
    url,
    confirmTitle,
    confirmText,
    confirmButtonText,
    cancelButtonText,
    successTitle,
    errorTitle
}) => {
    const result = await Swal.fire({
        icon: "warning",
        title: confirmTitle,
        text: confirmText,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: "#dc2626",
        reverseButtons: true
    });
    if (!result.isConfirmed) return false;

    try {
        const token = getAuthToken();
        const response = await api.delete(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
            icon: "success",
            title: response.data?.message || successTitle,
            timer: 1500,
            showConfirmButton: false
        });
        return true;
    } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
            icon: "error",
            title: error.response?.data?.message || errorTitle
        });
        return false;
    }
};
