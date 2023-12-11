import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginAdminform() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function loginAdmin(event) {
    event.preventDefault();

    try {
      const email = document.getElementById("admin-email").value;
      const password = document.getElementById("admin-password").value;
      console.log(email, password);
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      // get response data
      const token = data.data.token;
      const isSuperAdmin = data.data.is_super_admin;
      const tokenExpiresAt = data.data.token_expires_at;
      // simpan di local storage
      localStorage.setItem("token", token);
      localStorage.setItem("is-super-admin", isSuperAdmin);
      localStorage.setItem("token-expires-at", tokenExpiresAt);
    } catch (error) {
      setErrorMsg(error.response.data.errors);
      console.log(error.response.data.errors);
    }
  }

  return (
    <form onSubmit={loginAdmin} method="post">
      <div className="mb-3">
        {!errorMsg ? null : (
          <div className="bg-danger text-white rounded mb-3 p-2 ">
            ⛔ {errorMsg}
          </div>
        )}
        <label htmlFor="admin-email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="admin-email"
          name="admin-email"
          placeholder="name@example.com"
        ></input>
      </div>
      <div className="mb-3">
        <label htmlFor="admin-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="admin-password"
          name="admin-password"
          className="form-control"
          aria-describedby="passwordHelpBlock"
        ></input>
        <button
          type="button"
          className="btn btn-link w-100 text-end"
          style={{ textDecoration: "none" }}
          onClick={() => navigate("/resetpassword/admin")}
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
