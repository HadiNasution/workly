import { axiosGetFormData } from "../../controller/api-controller";
import { useEffect, useState } from "react";
import { toastWarning } from "../alert/SweetAlert";
import DaftarPengajuan from "../tabs/DaftarPengajuan";

export default function ModalDaftarPengajuan() {
  const [recap, setRecap] = useState([]);
  const [approved, setApproved] = useState(0);
  const [approve, setApprove] = useState(0);
  const [rejected, setRejected] = useState(0);
  const token = sessionStorage.getItem("token");

  const getDaftarPengajuan = () => {
    axiosGetFormData("http://localhost:3000/api/employee/permission", token)
      .then((result) => {
        setRecap(result.result);
        setApprove(result.status.approve);
        setApproved(result.status.approved);
        setRejected(result.status.rejected);
      })
      .catch((error) => {
        console.error("Get daftar pengajuan failed : ", error);
        toastWarning("Data kosong");
      });
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
