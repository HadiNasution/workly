import axios from "axios";
import { useState } from "react";
import Modal from "../Modal";

export default function ResetPasswordEmployee() {
  const [modalData, setModalData] = useState(null); // data (password dummy) yg akan dikirim di modal
  const [error, setError] = useState(null);
  const goBack = () => {
    window.history.back();
  };
  async function ResetPasswordEmployee(event) {
    event.preventDefault();

    try {
      const name = document.getElementById("employee-name").value;
      const nip = document.getElementById("employee-nip").value;
      const email = document.getElementById("employee-email").value;

      const { data } = await axios.post(
        "http://localhost:3000/api/employee/resetpassword",
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
      localStorage.setItem("token", null);
      localStorage.setItem("token-expires-at", null);
    } catch (error) {
      setError(error.response.data.errors);
      console.log(error.response.data.errors);
    }
  }

  return (
    <div className="position-relative w-100">
      <div
        className="bg-light-subtle position-absolute top-50 start-50 translate-middle pt-2 pb-2 ps-5 pe-5 rounded-4"
        style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)" }}
      >
        <img
          src="../../../public/assets/reset-password-animated.gif"
          alt="animated password ill"
          width={100}
          height={100}
        />
        <h2 className="fw-bolder">Reset Password - Employee</h2>
        <p>Masukan Nama lengkap, NIP, dan Email untuk Reset password.</p>
        {!error ? null : (
          <div className="bg-danger text-white rounded mb-3 p-2 ">
            ⛔ {error}
          </div>
        )}
        <form onSubmit={ResetPasswordEmployee} method="post">
          <div className="mb-3">
            <label htmlFor="employee-name" className="form-label">
              Nama lengkap
            </label>
            <input
              type="text"
              className="form-control"
              id="employee-name"
              name="employee-name"
              placeholder="Ichbal Hadi Nasution"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="employee-nip" className="form-label">
              NIP
            </label>
            <input
              type="text"
              className="form-control"
              id="employee-nip"
              name="employee-nip"
              placeholder="183040066"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="employee-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="employee-email"
              name="employee-email"
              placeholder="name@example.com"
            ></input>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Reset Password
            </button>
            <button
              type="submit"
              onClick={() => goBack()}
              className="btn btn-outline-secondary w-100 mt-3"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
      <Modal data={modalData} />
    </div>
  );
}
