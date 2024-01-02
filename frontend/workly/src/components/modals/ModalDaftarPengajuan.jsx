import axios from "axios";
import { useEffect, useState } from "react";
import { toastWarning } from "../alert/SweetAlert";
import DaftarPengajuan from "../tabs/DaftarPengajuan";

export default function ModalDaftarPengajuan() {
  const [recap, setRecap] = useState(null);
  const [approved, setApproved] = useState(0);
  const [approve, setApprove] = useState(0);
  const [rejected, setRejected] = useState(0);

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
        setRecap(data.data.result);
        setApprove(data.data.status.approve);
        setApproved(data.data.status.approved);
        setRejected(data.data.status.rejected);
      }
    } catch (error) {
      console.error("Server Response:", error.response.data.errors);
      toastWarning("Data kosong");
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
            <div className="modal-body">
              <DaftarPengajuan
                data={recap}
                approve={approve}
                approved={approved}
                rejected={rejected}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
