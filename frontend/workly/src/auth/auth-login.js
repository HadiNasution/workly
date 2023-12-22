// cek apakah user merupakan admin
export const adminAuth = () => {
  const token = sessionStorage.getItem("token");
  const isAdmin = sessionStorage.getItem("is-super-admin");
  return token && isAdmin ? true : false;
};

// cek apakah user merupakan employee
export const employeeAuth = () => {
  const token = sessionStorage.getItem("token");
  const picture = localStorage.getItem("picture");
  return token && picture ? true : false;
};

// cek apakah token masih berlaku
export const isTokenExpired = () => {
  const token = sessionStorage.getItem("token-expires-at");
  const currentTime = new Date().getTime(); // Waktu saat ini dalam bentuk timestamp
  const expiresTime = new Date(token).getTime(); // Waktu kadaluwarsa dalam bentuk timestamp
  // console.log(currentTime);
  // console.log(expiresTime);
  return currentTime > expiresTime;
};
