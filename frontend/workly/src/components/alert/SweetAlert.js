import Swal from "sweetalert2";

export const toastSuccess = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "success",
    background: "#555555",
    color: "#FFFFFF",
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    position: "top",
  });
};

export const alertError = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "error",
    background: "#555555",
    color: "#FFFFFF",
    position: "center",
  });
};

export const toastWarning = async (title) => {
  return Swal.fire({
    title: title,
    icon: "warning",
    background: "#555555",
    color: "#FFFFFF",
    timer: 4000,
    timerProgressBar: true,
    toast: true,
    position: "center",
  });
};
