// cek apakah user merupakan admin
export const adminAuth = () => {
  const token = sessionStorage.getItem("token");
  const isAdmin = sessionStorage.getItem("is_super_admin");
  return token && isAdmin ? true : false;
};

// cek apakah user merupakan employee
export const employeeAuth = () => {
  const token = sessionStorage.getItem("token");
  return token ? true : false;
};

// cek apakah token masih berlaku
export const isTokenExpired = () => {
  const token = sessionStorage.getItem("token-expires-at");
  const currentTime = new Date();
  const convertTime = new Date(currentTime);
  const localCurrentTime = convertTime.toLocaleString();
  const expiresTime = new Date(token);
  const expiresLocalTime = expiresTime.toLocaleString();
  return localCurrentTime > expiresLocalTime ? true : false;
};
