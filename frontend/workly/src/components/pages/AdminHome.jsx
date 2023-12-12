import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();
  const logoutAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      // Lakukan permintaan ke API Logout dengan menyertakan token
      const { data } = await axios.delete(
        "http://localhost:3000/api/admin/logout",
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
        localStorage.removeItem("is-super-admin");
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  return (
    <>
      <h1>Admin Homepage</h1>
      <button onClick={logoutAdmin} className="btn btn-danger">
        Logout
      </button>
    </>
  );
};

export default AdminHome;
