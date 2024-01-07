import { axiosGet } from "../../controller/api-controller";
import axios from "axios";
import { toastSuccess, toastWarning } from "../alert/SweetAlert";
import { useState, useEffect } from "react";

export default function ModalUpdateAdmin({ adminId, modalId, reload }) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);
  const [idUser, setIdUser] = useState(0);
  const [id, setId] = useState(adminId);
  const token = sessionStorage.getItem("token");

  const getAdmin = async (id) => {
    axiosGet(`http://localhost:3000/api/admin/get/admin/${id}`, token)
      .then((result) => {
        setIdUser(result.id);
        setName(result.name);
        setNip(result.nip);
        setEmail(result.email);
        setStatus(result.is_super_admin);
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
        toastWarning("Data admin tidak ditemukan");
      });
  };

  const updateAdmin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/update/admin",
        {
          id: idUser,
          name: name,
          nip: nip,
          email: email,
          is_super_admin: status,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.data) {
        toastSuccess("Berhasil update", data.data);
        reload();
      }
    } catch (error) {
      console.error("Server Response:", error);
      if (error.response.data.errors) setError(error.response.data.errors);
    }
  };

  useEffect(() => {
    setId(adminId);
  }, [adminId, id]);

  return (
    <>
      <button
        className="btn btn-info me-3"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
        onClick={() => getAdmin(id)}
      >
        Update
      </button>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={modalId}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={modalId}>
                Update admin
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
              <form method="post" className="text-start" onSubmit={updateAdmin}>
                <input type="hidden" name="id" value={adminId} />
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nama
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name ? name : ""}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div className="mb-3">
                  <label htmlFor="nip" className="form-label">
                    NIP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nip"
                    value={nip ? nip : ""}
                    onChange={(e) => setNip(e.target.value)}
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
                    value={email ? email : ""}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="status"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  ></input>
                  <label className="form-check-label" htmlFor="using-shot">
                    Super admin
                  </label>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3 mb-3"
                  type="submit"
                >
                  Update admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
