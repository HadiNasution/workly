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
import { axiosGet, axiosDelete } from "../../controller/api-controller";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [worked, setWorked] = useState(false);
  const [isWorked, setIsWorked] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const token = sessionStorage.getItem("token");

  const handleAbsentState = () => {
    setIsWorked(!worked);
  };

  const getAttendance = () => {
    axiosGet(`http://localhost:3000/api/employee/attendance/day`, token)
      .then((result) => {
        setWorked(result.is_working);
        setIsWorked(result.is_working);
      })
      .catch((error) => {
        console.error("Get attendance failed : ", error);
      });
  };

  const logoutEmployee = () => {
    axiosDelete("http://localhost:3000/api/employee/logout", token)
      .then((result) => {
        sessionStorage.clear();
        localStorage.clear();
        toastSuccess("See you!", "");
        // lalu redirect ke halaman login
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed : ", error);
        alertError("Logout gagal", error.response.data.errors);
      });
  };

  const getSetting = () => {
    axiosGet("http://localhost:3000/api/employee/setting", token)
      .then((result) => {
        setOfficeName(result.office_name);
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
      });
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
    getAttendance();
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [worked]);

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
                className="logo me-3 mb-3"
              ></img>
              <h1>
                Heyoo {name}! <br></br>
                <span
                  className="fs-5"
                  style={{ color: "gray", fontWeight: "lighter" }}
                >
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
          {isWorked ? (
            <AbsenOut isWorked={worked} />
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
