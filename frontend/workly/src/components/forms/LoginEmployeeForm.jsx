import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginEmployeeForm() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function loginEmployee(event) {
    event.preventDefault();

    try {
      const email = document.getElementById("employee-email").value;
      const password = document.getElementById("employee-password").value;

      const { data } = await axios.post(
        "http://localhost:3000/api/employee/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      // simpan di storage
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("token-expires-at", data.data.token_expires_at);
      localStorage.setItem("name", data.data.name);
      localStorage.setItem("avatar", data.data.picture);
      // redirect ke halaman home admin
      navigate("/employee/home");
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      Swal.fire({
        title: "Ops! Masalah teknis",
        text: "Mohon maaf atas kendala yang terjadi, mohon untuk mencoba kembali lain waktu dan silahkan hubungi admin",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  }
  return (
    <form onSubmit={loginEmployee} method="post">
      <div className="mb-3">
        {!errorMsg ? null : (
          <div className="bg-danger text-white rounded mb-3 p-2 ">
            ⛔ {errorMsg}
          </div>
        )}
        <label for="employee-email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="employee-email"
          name="employee-email"
          placeholder="name@example.com"
        ></input>
      </div>
      <div className="mb-3">
        <label for="employee-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="employee-password"
          name="employee-password"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        ></input>
        <button
          type="button"
          className="btn btn-link w-100 text-end"
          style={{ textDecoration: "none" }}
          onClick={() => navigate("/resetpassword/employee")}
        >
          Lupa password
        </button>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>
      </div>
    </form>
  );
}
