import axios from "axios";
import { toastSuccess, alertError, toastWarning } from "../alert/SweetAlert";
import { useState, useEffect } from "react";

export default function ModalTambahAdmin() {
  const [error, setError] = useState("");
  const [setting, setSetting] = useState("");
  const [superAdmin, setSuperAdmin] = useState(false);
  const token = sessionStorage.getItem("token");

  const tambahAdmin = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const nip = document.getElementById("nip").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/create/admin",
        {
          name,
          nip,
          email,
          password,
          is_super_admin: superAdmin,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        toastSuccess(`Admin ${name} berhasil ditambahkan`, "");
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Server Response:", error);
      error.response.data.errors
        ? setError(error.response.data.errors)
        : alertError("Admin gagal ditambahkan", error);
    }
  };

  const getSetting = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/setting",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) setSetting(data.data);
    } catch (error) {
      console.error("Server Response:", error);
      toastWarning("Data setting kosong");
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <>
      <button
        className="btn btn-primary w-50"
        data-bs-toggle="modal"
        data-bs-target="#tambahAdminModal"
      >
        Tambah Admin
      </button>
      <div
        className="modal fade"
        id="tambahAdminModal"
        tabIndex="-1"
        aria-labelledby="tambahAdminModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="tambahAdminModalLabel">
                Tambah Admin
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {!error ? null : (
                <div className="bg-danger text-white text-start rounded mb-3 p-2">
                  ⛔ {error}
                </div>
              )}
              <form method="post" onSubmit={tambahAdmin} className="text-start">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nama
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="nip" className="form-label">
                    NIP
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nip"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Default Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    value={
                      setting.default_password ? setting.default_password : ""
                    }
                    aria-label="Disabled input example"
                    disabled
                    readOnly
                  ></input>
                </div>
                <div className="form-check form-switch form-check-reverse text-start">
                  <label className="form-check-label" htmlFor="using-shot">
                    Super admin
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="status"
                    value={superAdmin}
                    onChange={() => setSuperAdmin(!superAdmin)}
                  ></input>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3 mb-3"
                  type="submit"
                >
                  Tambah Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
