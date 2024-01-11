import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toastSuccess } from "../alert/SweetAlert";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

export default function LoginEmployeeForm() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  async function loginEmployee(event) {
    event.preventDefault();

    try {
      const email = document.getElementById("employee-email").value;

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
      // simpan di storage
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("token-expires-at", data.data.token_expires_at);
      localStorage.setItem("name", data.data.name);
      localStorage.setItem("avatar", data.data.picture);
      localStorage.setItem("email", data.data.email);
      localStorage.setItem("role", data.data.role);
      toastSuccess("Login berhasil!", "Senang melihat anda lagi");
      // redirect ke halaman home admin
      navigate("/employee/home");
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data.errors);
        setErrorMsg(error.response.data.errors);
      }
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
        <label htmlFor="employee-email" className="form-label">
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
        <label htmlFor="employee-password" className="form-label">
          Password
        </label>
        <div class="input-group mb-1">
          <input
            type={showPassword ? "text" : "password"}
            id="employee-password"
            name="employee-password"
            className="form-control"
            aria-describedby="show"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button
            class="btn btn-outline-secondary"
            type="button"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
            id="show"
          >
            {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
          </button>
        </div>
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
