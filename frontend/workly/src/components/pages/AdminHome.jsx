import { axiosDelete } from "../../controller/api-controller";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAdminTokenExpired } from "../../auth/auth-login";
import { toastSuccess, alertError, toastWarning } from "../alert/SweetAlert";
import RecapAdminTab from "../tabs/RecapAdmin";
import ModalSetting from "../modals/ModalSetting";
import ModalKelolaPengajuan from "../modals/ModalKelolaPengajuan";
import ModalGantiPassword from "../modals/ModalGantiPassword";
import ModalCreateAnnouncement from "../modals/ModalCreateAnnouncement";

const AdminHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("admin-name");
  const email = localStorage.getItem("admin-email");
  const nip = localStorage.getItem("admin-nip");
  const superAdmin = sessionStorage.getItem("is-super-admin");
  let role = superAdmin === "true" ? "Super admin" : "Administrator";
  const token = sessionStorage.getItem("admin-token");

  const logoutAdmin = () => {
    axiosDelete("http://localhost:3000/api/admin/logout", token)
      .then((result) => {
        sessionStorage.clear();
        localStorage.removeItem("admin-name");
        localStorage.removeItem("admin-nip");
        localStorage.removeItem("admin-email");
        // lalu redirect ke halaman login
        toastSuccess("See you!", "");
        navigate("/");
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
        alertError("Logout gagal", error.response.data.errors);
      });
  };

  const showSuperAdminMenu = () => {
    if (superAdmin === "true") {
      return (
        <>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <img
                  src="../../../public/assets/admin.png"
                  alt="admin-icon"
                  height={50}
                  width={50}
                ></img>
                <p className="d-inline ms-2">
                  <a
                    className="stretched-link"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => navigate("/admin/manage/admin")}
                  >
                    Admin
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <img
                  src="../../../public/assets/setting.png"
                  alt="admin-icon"
                  height={50}
                  width={50}
                ></img>
                <ModalSetting />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    // Fungsi untuk pengecekan expired token
    const checkTokenExpiration = () => {
      if (isAdminTokenExpired()) {
        toastWarning("Sesi habis", "Silahkan untuk login kembali");
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
          <div className="d-flex justify-content-between align-items-center">
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
                <span
                  className="fs-5"
                  style={{ color: "gray", fontWeight: "lighter" }}
                >
                  {role} • {email} • {nip}
                </span>
              </h1>
            </div>
            <div className="action">
              <ModalGantiPassword />
              <button
                type="button"
                className="btn btn-danger h-25 ms-3"
                style={{ width: 80 }}
                onClick={() => logoutAdmin()}
              >
                Logout
              </button>
            </div>
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
                height={50}
                width={50}
              ></img>
              <p className="d-inline ms-2">
                <a
                  className="stretched-link"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => navigate("/admin/manage/employee")}
                >
                  Karyawan
                </a>
              </p>
            </div>
          </div>
        </div>
        {showSuperAdminMenu()}
        <div className="col">
          <ModalKelolaPengajuan />
        </div>
        <div className="col">
          <ModalCreateAnnouncement />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <RecapAdminTab />
        </div>
      </div>
    </>
  );
};

export default AdminHome;
