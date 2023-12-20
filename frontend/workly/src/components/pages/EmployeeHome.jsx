import axios from "axios";
import { useNavigate } from "react-router-dom";
import AbsenIn from "../cards/AbsenIn";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../auth/auth-login";
import AbsenOut from "../cards/AbsenOut";
import RecapEmployeeTab from "../tabs/RecapEmployee";
import DetailProfileEmployee from "../offcanvas/DetailProfileEmployee";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [absent, setAbsent] = useState(null);
  let storedState = localStorage.getItem("has-absent");
  // console.log(storedState);

  const handleAbsentState = () => {
    localStorage.setItem("has-absent", !absent);
    setAbsent(!absent);
  };

  // console.log(absent);

  useEffect(() => {
    // cek apakah token masih berlaku
    if (isTokenExpired()) {
      // jika sudah tidak berlaku, maka...
      sessionStorage.clear();
      localStorage.removeItem("name");
      localStorage.removeItem("avatar");
      localStorage.removeItem("shot");
      navigate("/");
    }
    setAbsent(storedState);
  }, [navigate, storedState]);

  return (
    <>
      <div className="row g-0">
        <div className="text-start col-sm-6 col-md-8">
          <h1>Heyoo {name}! 🖐</h1>
        </div>
        <div className="text-end col-6 col-md-4">
          <DetailProfileEmployee />
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col">
          {absent === "true" ? (
            <AbsenOut onLogin={handleAbsentState} />
          ) : (
            <AbsenIn onLogin={handleAbsentState} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              📝<b>Pengajuan Cuti, Sakit, Izin, WFH</b>
            </div>
          </div>
        </div>
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              ✅<b>Hasil pengajuan</b>
            </div>
          </div>
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
