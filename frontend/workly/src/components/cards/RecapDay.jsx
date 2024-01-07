import {
  BsHouseFill,
  BsClockFill,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { axiosGet } from "../../controller/api-controller";
import { useState, useEffect } from "react";
import { fullTimeFormat } from "../../utils/date-time";

export default function RecapDay() {
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [late, setLate] = useState(false);
  const [wfh, setWfh] = useState(false);
  const token = sessionStorage.getItem("token");

  const getRecap = () => {
    axiosGet(`http://localhost:3000/api/employee/attendance/day`, token)
      .then((result) => {
        setTimeIn(
          result.time_in ? fullTimeFormat(result.time_in) : "Data masih kosong"
        );
        setTimeOut(
          result.time_out
            ? fullTimeFormat(result.time_out)
            : "Data masih kosong"
        );
        setLate(result.is_late ? "Terlambat" : "Tepat waktu");
        setWfh(result.is_wfh ? "WFH" : "Dikantor");
      })
      .catch((error) => {
        console.error("Get recap day failed ", error);
      });
  };

  useEffect(() => {
    //reload data recap setiap 1 detik
    const reloadRecap = () => {
      getRecap();
    };
    reloadRecap();
    const intervalId = setInterval(reloadRecap, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="row mb-5">
      <div className="col">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <BsArrowRightSquareFill className="me-2 mb-1 fs-4" color="blue" />
              <h4>Absen Masuk</h4>
            </div>
            <div className="d-flex justify-content-start">
              <p className="me-4">
                <BsClockFill className="me-1 mb-1" color="gray" />
                {timeIn ? timeIn : <i>Data masih kosong</i>}
              </p>
              <p className="me-4">
                <BsHouseFill className="me-1 mb-1" color="gray" />
                {wfh ? wfh : <i>Data masih kosong</i>}
              </p>
              <p>
                <BsExclamationCircleFill className="me-2" color="gray" />
                {late ? late : <i>Data masih kosong</i>}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <BsArrowLeftSquareFill
                className="me-2 mb-1 fs-4"
                color="orange"
              />
              <h4>Absen Keluar</h4>
            </div>
            <div className="d-flex justify-content-start">
              <p className="me-4">
                <BsClockFill className="me-1 mb-1" color="gray" />
                {timeOut ? timeOut : <i>Data masih kosong</i>}
              </p>
              <p>
                <BsHouseFill className="me-1 mb-1" color="gray" />
                {wfh ? wfh : <i>Data masih kosong</i>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
