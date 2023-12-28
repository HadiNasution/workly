import { useState, useEffect } from "react";
import {
  BsGeoAltFill,
  BsCalendar2Fill,
  BsClockFill,
  BsArrowLeftSquareFill,
} from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";
import { toastSuccess, alertError } from "../alert/SweetAlert";
import { dayString, monthString, date, year } from "../../utils/date-time";

export default function AbsenOut({ isWorked }) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [disable, setDisable] = useState(isWorked);
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());

  const confirmOut = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda ingin absen keluar?",
      icon: "question",
      background: "#555555",
      color: "#FFFFFF",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setDisable(true);
        absenOut();
      }
    });
  };

  const absenOut = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/employee/absenOut/-6.935783427330478/107.5782643924172`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      toastSuccess(data.data, "See you!");
    } catch (error) {
      console.log(error);
      alertError("Oops! Absen keluar gagal", error.response.data.errors);
    }
  };

  useEffect(() => {
    // get koordinat latitude longitude saat komponen pertamakali dirender
    const getPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            alertError("Gagal mendapatkan lokasi", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        alertError(
          "Gagal mendapatkan lokasi",
          "Geolocation is not supported by this browser."
        );
      }
    };

    getPosition();

    const intervalId = setInterval(() => {
      setHours(new Date().getHours());
      setMinutes(new Date().getMinutes());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="card text-center">
      <div className="card-header">
        <div className="d-flex justify-content-center">
          <div className="d-flex align-items-center me-3">
            <BsArrowLeftSquareFill className="me-1" color="orange" /> Absen
            Keluar
          </div>
          <div className="d-flex align-items-center me-3 ms-3">
            <BsClockFill className="me-1" /> {hours}:{minutes < 10 ? "0" : ""}
            {minutes}
          </div>
          <div className="d-flex align-items-center ms-3">
            <BsCalendar2Fill className="me-1" /> {dayString()} {date}/
            {monthString()}/{year}
          </div>
        </div>
      </div>
      <div className="card-body">
        <button
          onClick={confirmOut}
          className="btn btn-primary w-100 m-1"
          disabled={disable}
        >
          Absen keluar
        </button>
      </div>
      <div className="card-footer text-body-secondary">
        {latitude && longitude ? (
          <p style={{ color: "#11f227" }}>
            <BsGeoAltFill className="me-1" />
            Lokasi aktif
          </p>
        ) : (
          <p style={{ color: "#e00727" }}>
            Lokasi tidak aktif, izinkan akses lokasi dibrowser untuk situs ini
            atau periksa koneksi internet
          </p>
        )}
      </div>
    </div>
  );
}
