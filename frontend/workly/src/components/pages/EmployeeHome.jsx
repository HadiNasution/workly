import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const logoutEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      // Lakukan permintaan ke API Logout dengan menyertakan token
      const { data } = await axios.delete(
        "http://localhost:3000/api/employee/logout",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data.data);
      // Jika logout berhasil, hapus token dari local storage
      if (data.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("token-expires-at");
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  return (
    <>
      <h1>Employee Homepage</h1>
      <button onClick={logoutEmployee} className="btn btn-danger">
        Logout
      </button>
    </>
  );
};

export default EmployeeHome;
