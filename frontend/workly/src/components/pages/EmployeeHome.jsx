import { useNavigate } from "react-router-dom";
import AbsenIn from "../cards/AbsenIn";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../auth/auth-login";
import AbsenOut from "../cards/AbsenOut";
import RecapEmployeeTab from "../tabs/RecapEmployee";
import DetailProfileEmployee from "../offcanvas/DetailProfileEmployee";
import ModalPengajuan from "../modals/ModalPengajuan";
import ModalDaftarPengajuan from "../modals/ModalDaftarPengajuan";
import { toastWarning, alertError, toastSuccess } from "../alert/SweetAlert";
import axios from "axios";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [absent, setAbsent] = useState(false);
  const [officeName, setOfficeName] = useState("");
  let storedState = localStorage.getItem("isWorking");

  const handleAbsentState = () => {
    localStorage.setItem("isWorking", !absent);
    setAbsent(!absent);
  };

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
        sessionStorage.clear();
        localStorage.removeItem("name");
        localStorage.removeItem("avatar");
        localStorage.removeItem("shot");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        toastSuccess("Logout berhasil", "See you!");
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.error("Server Response:", error.response.data);
      alertError("Logout gagal", error.response.data.errors);
    }
  };

  const getSetting = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/employee/setting",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setOfficeName(data.data.office_name);
      }
    } catch (error) {
      console.log(error);
      toastWarning("Data setting kosong");
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      // cek apakah token masih berlaku
      if (isTokenExpired()) {
        toastWarning("Sesi habis, silahkan untuk login kembali");
        logoutEmployee();
      }
    };

    getSetting();
    checkTokenExpiration();
    setAbsent(storedState);
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [storedState, absent]);
  return (
    <>
      <div className="row g-0 mt-5">
        <div className="col">
          <div className="d-flex align-items-center justify-content-between">
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
                <span className="fs-5 text-secondary">
                  {officeName} • {role} • {email}
                </span>
              </h1>
            </div>
            <DetailProfileEmployee />
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col">
          {storedState === "true" ? (
            <AbsenOut onLogin={handleAbsentState} />
          ) : (
            <AbsenIn onLogin={handleAbsentState} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md mt-2">
          <ModalPengajuan />
        </div>
        <div className="col-md mt-2">
          <ModalDaftarPengajuan />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <RecapEmployeeTab />
        </div>
      </div>
    </>
  );
};

export default EmployeeHome;
