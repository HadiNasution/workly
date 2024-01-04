import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { useState, useEffect } from "react";

export default function ModalUpdateKaryawan({ userId, modalId, reload }) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeNip, setEmployeeNip] = useState("");
  const [role, setRole] = useState("");
  const [departmen, setDepartmen] = useState("");
  const [join, setJoin] = useState("");
  const [quit, setQuit] = useState("");
  const [idUser, setIdUser] = useState(0);
  const [id, setId] = useState(userId);
  const token = sessionStorage.getItem("token");

  const getEmployee = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/get/employee/${id}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setIdUser(data.data.id);
        setName(data.data.name);
        setEmployeeNip(data.data.nip);
        setEmail(data.data.email);
        setRole(data.data.role);
        setDepartmen(data.data.departmen);
        setJoin(data.data.join_date);
        setQuit(data.data.quit_date);
      }
    } catch (error) {
      console.error("Server Response:", error);
      //   alertError("Data tidak ditemukan", error.response.data.errors);
    }
  };

  const dateFormat = (date) => {
    const originalDateString = new Date(date);
    const originalDate = new Date(originalDateString);

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1;
    const year = originalDate.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const updateEmployee = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/update/employee",
        {
          id: idUser,
          name: name,
          nip: employeeNip,
          email: email,
          role: role,
          departmen: departmen,
          join_date: join,
          quit_date: quit,
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
    setId(userId);
  }, [userId, id]);

  return (
    <>
      <button
        className="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
        onClick={() => getEmployee(id)}
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
                Update karyawan
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
                className="text-start"
                onSubmit={updateEmployee}
              >
                <input type="hidden" name="id" value={idUser} />
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
                    value={employeeNip ? employeeNip : ""}
                    onChange={(e) => setEmployeeNip(e.target.value)}
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
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    value={role ? role : ""}
                    onChange={(e) => setRole(e.target.value)}
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
                    value={departmen ? departmen : ""}
                    onChange={(e) => setDepartmen(e.target.value)}
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
                        value={join ? dateFormat(join) : ""}
                        onChange={(e) => setJoin(e.target.value)}
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
                        value={quit ? dateFormat(quit) : ""}
                        onChange={(e) => setQuit(e.target.value)}
                        name="tanggal-keluar"
                      ></input>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3 mb-3"
                  type="submit"
                >
                  Update karyawan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
