import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { useState } from "react";

export default function ModalTambahKaryawan() {
  const [error, setError] = useState("");

  const tambahKaryawan = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const nip = document.getElementById("nip").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const departmen = document.getElementById("departmen").value;
    const tanggalMasuk = document.getElementById("tanggal-masuk").value;
    const tanggalKeluar = document.getElementById("tanggal-keluar").value;
    const token = sessionStorage.getItem("token");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/create/employee",
        {
          name,
          nip,
          email,
          role,
          departmen,
          join_date: tanggalMasuk,
          quit_date: tanggalKeluar,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      //   console.log(data.data);
      if (data.data) {
        toastSuccess(`Karyawan ${name} berhasil ditambahkan`, "");
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Server Response:", error);
      error.response.data.errors
        ? setError(error.response.data.errors)
        : alertError("Karyawan gagal ditambahkan", error);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary w-50"
        data-bs-toggle="modal"
        data-bs-target="#tambahKaryawanModal"
      >
        Tambah karyawan
      </button>
      <div
        className="modal fade"
        id="tambahKaryawanModal"
        tabIndex="-1"
        aria-labelledby="tambahKaryawanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="tambahKaryawanModalLabel">
                Tambah karyawan
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
              <form
                method="post"
                onSubmit={tambahKaryawan}
                className="text-start"
              >
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
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="departmen" className="form-label">
                    Departmen
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="departmen"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="tanggal-masuk" className="form-label">
                        Tanggal bergabung:
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="tanggal-masuk"
                        name="tanggal-masuk"
                        required
                      ></input>
                    </div>
                    <div className="col">
                      <label htmlFor="tanggal-keluar" className="form-label">
                        Tanggal jatuh tempo:
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="tanggal-keluar"
                        name="tanggal-keluar"
                      ></input>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3 mb-3"
                  type="submit"
                >
                  Tambah karyawan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
