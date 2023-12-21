import { useNavigate } from "react-router-dom";
import AbsenIn from "../cards/AbsenIn";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../auth/auth-login";
import AbsenOut from "../cards/AbsenOut";
import RecapEmployeeTab from "../tabs/RecapEmployee";
import DetailProfileEmployee from "../offcanvas/DetailProfileEmployee";
import ModalPengajuan from "../modals/ModalPengajuan";
import ModalDaftarPengajuan from "../modals/ModalDaftarPengajuan";

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
      <div className="row g-0 mt-5">
        <div className="col">
          <div className="d-flex align-items-end justify-content-between">
            <h1>
              <img
                src="../../../public/assets/hello.png"
                alt="waving-hand"
                width={80}
                height={80}
              ></img>
              Heyoo {name}!
            </h1>
            <DetailProfileEmployee />
          </div>
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
