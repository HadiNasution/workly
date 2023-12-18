import axios from "axios";
import { useNavigate } from "react-router-dom";
import AbsenIn from "../card/AbsenIn";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../auth/auth-login";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");
  let avatarPath = avatar
    ? `http://localhost:3000/${avatar}`
    : "/assets/avatar-default.svg";
  useEffect(() => {
    // cek apakah token masih berlaku
    if (isTokenExpired()) {
      // jika sudah tidak berlaku, maka...
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("token-expires-at");
      localStorage.removeItem("name");
      localStorage.removeItem("avatar");
      navigate("/");
    }
  }, [navigate]);
  const logoutEmployee = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(
        "http://localhost:3000/api/employee/logout",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      // Jika logout berhasil, hapus token dari session storage
      if (data.data) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("token-expires-at");
        localStorage.removeItem("name");
        localStorage.removeItem("avatar");
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  return (
    <>
      <div className="row g-0">
        <div className="text-start col-sm-6 col-md-8">
          <h1>Heyoo! {name} 🖐</h1>
        </div>
        <div className="text-end col-6 col-md-4">
          <img
            src={avatarPath}
            alt="foto-profile"
            className="rounded-circle"
            width={60}
            height={60}
          />
          <button onClick={logoutEmployee} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col">
          <AbsenIn />
        </div>
      </div>
      <div className="row">
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              This is some text within a card body.
            </div>
          </div>
        </div>
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              This is some text within a card body.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeHome;
