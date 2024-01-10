import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";

export default function ModalGantiPassword() {
  const gantiPassword = async (event) => {
    event.preventDefault();
    const newPass = document.getElementById("password").value;
    try {
      const token = sessionStorage.getItem("admin-token");
      const { data } = await axios.put(
        "http://localhost:3000/api/admin/change/password",
        {
          password: newPass,
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
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password baru"
                  name="password"
                  id="password"
                />
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
