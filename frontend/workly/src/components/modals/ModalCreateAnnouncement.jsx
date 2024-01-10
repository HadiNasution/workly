import axios from "axios";
import { axiosGet } from "../../controller/api-controller";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { useState, useEffect } from "react";

export default function ModalCreateAnnouncement() {
  const [announcement, setAnnouncement] = useState("");
  const [message, setMessage] = useState("");
  const token = sessionStorage.getItem("admin-token");

  const getAnnouncement = () => {
    axiosGet("http://localhost:3000/api/admin/announcement", token)
      .then((result) => {
        setAnnouncement(result.announcement);
        setMessage(result.message);
      })
      .catch((error) => {
        console.error("Get announcement failed", error);
      });
  };

  const postPengumuman = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/announcement",
        {
          announcement,
          message,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.data) {
        toastSuccess("Pengumuman berhasil diposting", "");
      }
    } catch (error) {
      console.error("Server Response:", error);
      alertError("Ops! Pengumuman gagal diposting", error);
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/announcement.png"
            alt="holiday"
            height={50}
            width={50}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#pengajuanModal"
            >
              Pengumuman
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
                Posting Pengumuman/Pesan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form method="post" onSubmit={postPengumuman}>
                <div className="mb-3">
                  <label htmlFor="office-address" className="form-label">
                    Pengumuman
                  </label>
                  <textarea
                    className="form-control"
                    id="announcement"
                    rows="4"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                  ></textarea>
                  <div id="passwordHelpBlock" className="form-text">
                    ini akan muncul di menu pengumuman yang bersifat sementara.
                    (optional)
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="office-address" className="form-label">
                    Pesan
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <div id="passwordHelpBlock" className="form-text">
                    ini akan muncul di halaman utama karyawan yang bersifat
                    jangka panjang/teknis. (optional)
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Posting
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
