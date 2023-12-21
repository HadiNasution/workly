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
      console.log(data.data);
      if (data.data.time_in) {
        var dateInString = data.data.time_in;
        var dateInObject = new Date(dateInString);

        var jam = dateInObject.getHours();
        var menit = dateInObject.getMinutes();
        var hari = convertDayString(dateInObject);
        var tanggal = dateInObject.getDate();
        var bulan = dateInObject.getMonth() + 1;
        var tahun = dateInObject.getFullYear();
        const waktuMasuk = `${jam}:${menit} ${hari} ${tanggal}/${bulan}/${tahun}`;
        setTimeIn(waktuMasuk);
      } else {
        setTimeIn("Data masih kosong");
      }

      if (data.data.time_out) {
        var dateOutString = data.data.time_in;
        var dateOutObject = new Date(dateOutString);

        var jam = dateOutObject.getHours();
        var menit = dateOutObject.getMinutes();
        var hari = convertDayString(dateOutObject);
        var tanggal = dateOutObject.getDate();
        var bulan = dateOutObject.getMonth() + 1;
        var tahun = dateOutObject.getFullYear();
        const waktuMasuk = `${jam}:${menit} ${hari} ${tanggal}/${bulan}/${tahun}`;
        setTimeOut(waktuMasuk);
      } else {
        setTimeOut("Data masih kosong");
      }
      setLate(data.data.is_late ? "Terlambat" : "Tidak terlambat");
      setWfh(data.data.is_wfh ? "WFH" : "Dikantor");
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  useEffect(() => {
    getRecap();
  }, []);

  return (
    <div className="row">
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
