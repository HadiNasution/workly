import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function ModalDaftarPengajuan() {
  const getDaftarPengajuan = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/employee/permission",
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data) {
        console.log(data.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      Swal.fire({
        title: "Data kosong",
        icon: "warning",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  useEffect(() => {
    getDaftarPengajuan();
  }, []);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/bell.png"
            alt="holiday"
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#daftarPengajuanModal"
            >
              Status Pengajuan
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="daftarPengajuanModal"
        tabIndex="-1"
        aria-labelledby="daftarPengajuanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="daftarPenfajuanModalLabel">
                Daftar pengajuan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
