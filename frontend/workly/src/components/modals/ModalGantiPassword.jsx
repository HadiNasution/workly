import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";

export default function ModalGantiPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const gantiPassword = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("admin-token");
      const { data } = await axios.put(
        "http://localhost:3000/api/admin/change/password",
        {
          password,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        toastSuccess(data.data, "");
      }
    } catch (error) {
      console.error("Server Response:", error);
      if (error.response) {
        alertError("Oops! Gagal ganti password", error.response.data.errors);
      }
    }
    document.getElementById("password").value = "";
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Ganti password
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Ganti Password
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={gantiPassword}>
                <div class="input-group mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
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
                  className="btn btn-secondary btn-sm w-100 mt-3"
                  type="submit"
                >
                  Ganti password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
