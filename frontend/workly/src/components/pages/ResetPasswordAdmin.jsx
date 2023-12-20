import axios from "axios";
import { useState } from "react";
import ModalResetPassword from "../modals/ModalResetPassword";
import Swal from "sweetalert2";

export default function ResetPasswordAdmin() {
  const [modalData, setModalData] = useState(null); // data (password dummy) yg akan dikirim di modal
  const [error, setError] = useState(null);

  const goBack = () => {
    window.history.back();
  };

  async function resetPasswordAdmin(event) {
    event.preventDefault();

    try {
      const name = document.getElementById("admin-name").value;
      const nip = document.getElementById("admin-nip").value;
      const email = document.getElementById("admin-email").value;

      const { data } = await axios.post(
        "http://localhost:3000/api/admin/resetpassword",
        {
          name,
          nip,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setModalData(data.data);
      // hapus local storage
      localStorage.removeItem("token");
      localStorage.removeItem("is-super-admin");
      localStorage.removeItem("token-expires-at");
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data.errors);
        setError(error.response.data.errors);
      }
    }
  }

  return (
    <div className="position-relative w-100">
      <div
        className="bg-light-subtle position-absolute top-50 start-50 translate-middle pt-2 pb-2 ps-5 pe-5 rounded-4"
        style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)" }}
      >
        <img
          src="../../../public/assets/key.png"
          alt="key"
          height={80}
          width={80}
        ></img>
        <h2 className="fw-bolder">Reset Password - Admin</h2>
        <p>Masukan Nama lengkap, NIP, dan Email untuk Reset password.</p>
        {!error ? null : (
          <div className="bg-danger text-white rounded mb-3 p-2 ">
            ⛔ {error}
          </div>
        )}
        <form onSubmit={resetPasswordAdmin} method="post">
          <div className="mb-3">
            <label htmlFor="admin-name" className="form-label">
              Nama lengkap
            </label>
            <input
              type="text"
              className="form-control"
              id="admin-name"
              name="admin-name"
              placeholder="Ichbal Hadi Nasution"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="admin-nip" className="form-label">
              NIP
            </label>
            <input
              type="text"
              className="form-control"
              id="admin-nip"
              name="admin-nip"
              placeholder="183040066"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="admin-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="admin-email"
              name="admin-email"
              placeholder="name@example.com"
            ></input>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Reset Password
            </button>
            <a
              onClick={goBack}
              role="button"
              className="btn btn-outline-secondary w-100 mt-3"
            >
              Kembali
            </a>
          </div>
        </form>
      </div>
      <ModalResetPassword data={modalData} />
    </div>
  );
}
