import { useState, useEffect } from "react";
import { axiosGet } from "../../controller/api-controller";

export default function ModalAnnouncement() {
  const [announcement, setAnnouncement] = useState("");
  const token = sessionStorage.getItem("token");

  const getAnnouncement = () => {
    axiosGet("http://localhost:3000/api/employee/announcement", token)
      .then((result) => {
        setAnnouncement(result.announcement);
      })
      .catch((error) => {
        console.error("Get announcement failed", error);
      });
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
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#pengumumanModal"
            >
              Pengumuman
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="pengumumanModal"
        tabIndex="-1"
        aria-labelledby="pengumumanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="pengumumanModalLabel">
                Pengumuman
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ whiteSpace: "pre-line" }}>{announcement}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
