import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginAdminform() {
  const navigate = useNavigate();
  async function loginAdmin(event) {
    event.preventDefault();

    try {
      const email = document.getElementById("admin-email").value;
      const password = document.getElementById("admin-password").value;

      const { data } = await axios.post(
        "http://localhost:3000/api/admin/login",
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
      // get response data
      const token = data.data.token;
      const isSuperAdmin = data.data.is_super_admin;
      const tokenExpiresAt = data.data.token_expires_at;
      // simpan di local storage
      localStorage.setItem("token", token);
      localStorage.setItem("is-super-admin", isSuperAdmin);
      localStorage.setItem("token-expires-at", tokenExpiresAt);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <form onSubmit={loginAdmin} method="post">
      <div className="mb-3">
        <label htmlFor="admin-email" className="form-label">
          Email address
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
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long, contain letters and
          numbers, and must not contain spaces, special characters, or emoji.
        </div>
        <button
          type="button"
          className="btn btn-link w-100 text-end"
          style={{ textDecoration: "none" }}
          onClick={() => navigate("/resetpassword/admin")}
        >
          Forgot password
        </button>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>
      </div>
    </form>
  );
}
