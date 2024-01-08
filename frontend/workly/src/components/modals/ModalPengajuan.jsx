import { axiosGet } from "../../controller/api-controller";
import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { useEffect, useState } from "react";

export default function ModalPengajuan() {
  const [wfh, setWfh] = useState(true);
  const [batasWfh, setBatasWfh] = useState(0);
  const [batasCuti, setBatasCuti] = useState(0);
  const [recapCuti, setRecapCuti] = useState(0);
  const [recapWfh, setRecapWfh] = useState(0);
  const token = sessionStorage.getItem("token");

  const getSetting = () => {
    axiosGet("http://localhost:3000/api/employee/setting", token)
      .then((result) => {
        setWfh(result.enable_wfh);
        setBatasCuti(result.leaves_limit);
        setBatasWfh(result.wfh_limit);
      })
      .catch((error) => {
        console.error("Get daftar pengajuan failed : ", error);
        toastWarning("Data setting kosong");
      });
  };

  const getRecap = () => {
    axiosGet("http://localhost:3000/api/employee/recap", token)
      .then((result) => {
        setRecapCuti(result.count_leaves);
        setRecapWfh(result.count_wfh);
      })
      .catch((error) => {
        console.error("Get recap failed : ", error);
        toastWarning("Data recap kosong");
      });
  };

  const kirimPengajuan = async (event) => {
    event.preventDefault();

    const type = document.getElementById("tipe-pengajuan").value;
    const note = document.getElementById("catatan").value;
    const start_date = document.getElementById("waktu-mulai").value;
    const end_date = document.getElementById("waktu-selesai").value;
    const surat = document.getElementById("surat");
    const images = surat.files[0];

    try {
      const formData = new FormData();
      formData.append("surat", images);
      formData.append("type", type);
      formData.append("note", note);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);

      const { data } = await axios.post(
        "http://localhost:3000/api/employee/create/permission",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data) {
        toastSuccess(
          "Pengajuan berhasil",
          "Untuk melihat status pengajuan, buka menu status pengajuan"
        );
      }
    } catch (error) {
      console.error("Server Response:", error);
      if (error.response) {
        alertError("Ops! Pengajuan gagal dikirim", error.response.data.errors);
      }
    }
  };

  useEffect(() => {
    getSetting();
    getRecap();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/holiday.png"
            alt="holiday"
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#pengajuanModal"
            >
              Pengajuan Cuti, Sakit, Izin, WFH
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="pengajuanModal"
        tabIndex="-1"
        aria-labelledby="pengajuanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="pengajuanModalLabel">
                Pengajuan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                encType="multipart/form-data"
                method="post"
                onSubmit={kirimPengajuan}
              >
                <div className="mb-3">
                  {recapCuti >= batasCuti ? (
                    <div className="bg-warning text-white text-start rounded mb-3 p-2">
                      ⛔ Kuota cuti tahun ini sudah habis.
                    </div>
                  ) : null}
                  {recapWfh >= batasWfh ? (
                    <div className="bg-warning text-white text-start rounded mb-3 p-2">
                      ⛔ Kuota WFH bulan ini sudah habis.
                    </div>
                  ) : null}
                  <label className="mb-1">Alasan pengajuan</label>
                  <select
                    className="form-select mb-1"
                    aria-label="Default select example"
                    id="tipe-pengajuan"
                    required
                  >
                    <option value="sakit">Sakit</option>
                    {recapCuti >= batasCuti ? null : (
                      <option value="cuti">Cuti</option>
                    )}
                    <option value="izin">Izin</option>
                    {wfh || batasWfh >= recapWfh ? (
                      <option value="wfh">WFH</option>
                    ) : null}
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Catatan
                  </label>
                  <textarea
                    className="form-control"
                    id="catatan"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="mb-1">
                    Upload dokumen (surat sakit, surat izin, dll)
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    name="surat"
                    id="surat"
                  />
                  <div id="passwordHelpBlock" className="form-text">
                    format yang diterima : png, jpg, jpeg
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="datepicker" className="form-label">
                        Waktu mulai:
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="waktu-mulai"
                        name="waktu-mulai"
                        required
                      ></input>
                    </div>
                    <div className="col">
                      <label htmlFor="datepicker" className="form-label">
                        Waktu selesai:
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="waktu-selesai"
                        name="waktu-selesai"
                        required
                      ></input>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Kirim pengajuan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
