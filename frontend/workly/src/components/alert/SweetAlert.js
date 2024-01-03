import Swal from "sweetalert2";

export const toastSuccess = (title, message) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: "success",
    timer: 3000,
    background: "#54b346",
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
    background: "#ebeb52",
    timer: 4000,
    timerProgressBar: true,
    toast: true,
    position: "center",
  });
};
