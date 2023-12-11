import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginEmployeeForm() {
  const navigate = useNavigate();
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
      // get response data
      const token = data.data.token;
      const tokenExpiresAt = data.data.token_expires_at;
      // simpan dilokal storage
      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-at", tokenExpiresAt);
    } catch (error) {
      console.log(error.response);
    }
  }
  return (
    <form onSubmit={loginEmployee} method="post">
      <div className="mb-3">
        <label for="employee-email" className="form-label">
          Email address
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
        <div id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long, contain letters and
          numbers, and must not contain spaces, special characters, or emoji.
        </div>
        <button
          type="button"
          className="btn btn-link w-100 text-end"
          style={{ textDecoration: "none" }}
          onClick={() => navigate("/resetpassword/employee")}
        >
          Forgot password
        </button>
        <button type="button" className="btn btn-primary w-100 mt-3">
          Login
        </button>
      </div>
    </form>
  );
}
