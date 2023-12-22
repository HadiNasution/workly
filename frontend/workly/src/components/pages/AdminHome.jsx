import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isTokenExpired } from "../../auth/auth-login";
import Swal from "sweetalert2";
import RecapAdminTab from "../tabs/RecapAdmin";

const AdminHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const superAdmin = sessionStorage.getItem("is-super-admin");
  let role = superAdmin === "true" ? "Super admin" : "Administrator";

  const logoutAdmin = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // Lakukan permintaan ke API Logout dengan menyertakan token
      const { data } = await axios.delete(
        "http://localhost:3000/api/admin/logout",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      // Jika logout berhasil, hapus token dari session storage
      if (data.data) {
        sessionStorage.clear();
        localStorage.clear();
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  const showSuperAdminMenu = () => {
    if (superAdmin === "false") {
      return (
        <div className="col">
          <div className="card">
            <div className="card-body">
              <img
                src="../../../public/assets/admin.png"
                alt="admin-icon"
                height={60}
                width={60}
              ></img>
              <p className="d-inline ms-3">
                <a
                  className="stretched-link"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => navigate("/admin/manage/admin")}
                >
                  Kelola Admin
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    // Fungsi untuk pengecekan expired token
    const checkTokenExpiration = () => {
      if (isTokenExpired()) {
        Swal.fire({
          title: "Sesi habis",
          text: "Silahkan untuk login kembali",
          icon: "warning",
          background: "#555555",
          color: "#FFFFFF",
          position: "center",
        });
        logoutAdmin();
      }
    };

    // Jalankan pengecekan saat komponen dimount
    checkTokenExpiration();

    // Set interval untuk pengecekan setiap 1 menit (60.000 milidetik)
    const intervalId = setInterval(checkTokenExpiration, 60000);

    // Membersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="row g-0 mt-5">
        <div className="col">
          <div className="d-flex align-items-end mb-3 text-start">
            <img
              src="../../../public/assets/hello.png"
              alt="waving-hand"
              width={80}
              height={80}
              className="me-3 mb-3"
            ></img>
            <h1>
              Heyoo {name}! <br></br>
              <span className="fs-5 text-secondary">{role}</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <img
                src="../../../public/assets/employee.png"
                alt="employee-icon"
                height={60}
                width={60}
              ></img>
              <p className="d-inline ms-3">
                <a
                  className="stretched-link"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => navigate("/admin/manage/employee")}
                >
                  Kelola Karyawan
                </a>
              </p>
            </div>
          </div>
        </div>
        {showSuperAdminMenu()}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <img
                src="../../../public/assets/bell.png"
                alt="pengajuan-icon"
                height={60}
                width={60}
              ></img>
              <p className="d-inline ms-3">
                <a
                  className="stretched-link"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => navigate("/admin/manage/permission")}
                >
                  Kelola Pengajuan
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <RecapAdminTab />
        </div>
      </div>
    </>
  );
};

export default AdminHome;
