import {
  BsHouseFill,
  BsGeoAltFill,
  BsClockFill,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import axios from "axios";
import { useState, useEffect } from "react";
import { convertDayString } from "../../utils/date-time";

export default function RecapDay() {
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [late, setLate] = useState(null);
  const [wfh, setWfh] = useState(null);

  const formatTime = (date) => {
    const dateString = date;
    const dateObject = new Date(dateString);

    const jam = dateObject.getHours();
    const menit = dateObject.getMinutes();
    const hari = convertDayString(dateObject);
    const tanggal = dateObject.getDate();
    const bulan = dateObject.getMonth() + 1;
    const tahun = dateObject.getFullYear();
    return `${jam}:${menit} ${hari} ${tanggal}/${bulan}/${tahun}`;
  };

  const getRecap = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/employee/attendance/day`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(data.data);
      setTimeIn(
        data.data.time_in ? formatTime(data.data.time_in) : "Data masih kosong"
      );
      setTimeOut(
        data.data.time_out
          ? formatTime(data.data.time_out)
          : "Data masih kosong"
      );
      setLate(data.data.is_late ? "Terlambat" : "Tepat waktu");
      // console.log(data.data.time_out);
      // console.log(typeof data.data.time_out);
      setWfh(data.data.is_wfh ? "WFH" : "Dikantor");
    } catch (error) {
      // if (error.response) {
      //   console.error("Server Response:", error.response.data);
      // }
    }
  };

  useEffect(() => {
    //reload data recap setiap 1 detik
    const reloadRecap = () => {
      getRecap();
    };
    reloadRecap();
    const intervalId = setInterval(reloadRecap, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="row mb-5">
      <div className="col">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <BsArrowRightSquareFill
                className="me-2 fs-4"
                style={{ color: "cyan" }}
              />
              <h4>Absen Masuk</h4>
            </div>
            <div className="d-flex justify-content-start">
              <p className="me-4">
                <BsClockFill className="me-2" />
                {timeIn ? timeIn : <i>Data masih kosong</i>}
              </p>
              <p>
                <BsHouseFill className="me-2" />
                {wfh ? wfh : <i>Data masih kosong</i>}
              </p>
            </div>
            <div className="d-flex justify-content-start">
              <p className="me-4">
                <BsGeoAltFill className="me-2" />
                <i>Data masih kosong</i>
              </p>
              <p>
                <BsExclamationCircleFill className="me-2" />
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
                className="me-2 fs-4"
                style={{ color: "yellow" }}
              />
              <h4>Absen Keluar</h4>
            </div>
            <div className="d-flex justify-content-start">
              <p className="me-4">
                <BsClockFill className="me-2" />
                {timeOut ? timeOut : <i>Data masih kosong</i>}
              </p>
              <p>
                <BsHouseFill className="me-2" />
                {wfh ? wfh : <i>Data masih kosong</i>}
              </p>
            </div>
            <div className="d-flex justify-content-start">
              <p>
                <BsGeoAltFill className="me-2" />
                <i>Data masih kosong</i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
