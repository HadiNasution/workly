import Swal from "sweetalert2";

export const toastSuccess = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "success",
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
    position: "center",
  });
};

export const toastWarning = async (title) => {
  return Swal.fire({
    title: title,
    icon: "warning",
    timer: 4000,
    timerProgressBar: true,
    toast: true,
    position: "center",
  });
};
