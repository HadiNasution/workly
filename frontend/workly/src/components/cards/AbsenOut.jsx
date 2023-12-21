import { useState, useEffect } from "react";
import {
  BsGeoAltFill,
  BsCalendar2Fill,
  BsClockFill,
  BsArrowLeftSquareFill,
} from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";
import {
  dayString,
  monthString,
  date,
  hours,
  minutes,
  year,
} from "../../utils/date-time";

export default function AbsenOut({ onLogin }) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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
        absenOut();
        Swal.fire({
          title: "Absen keluar berhasil!",
          icon: "success",
          background: "#555555",
          color: "#FFFFFF",
          timer: 3000, // Durasi dalam milidetik
          timerProgressBar: true,
          toast: true,
          position: "center",
        });
      }
    });
  };

  const absenOut = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/employee/absenOut/${latitude}/${longitude}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      onLogin(); // set state login di parent, agar card absen out diganti card absen in
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Absen keluar gagal!",
        text: "Pastikan akses lokasi disitus ini sudah diizinkan",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  useEffect(() => {
    // get koordinat latitude longitude
    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };

    getPosition(); // ambil koordinat saat kopmponen pertamakali dirender
  }, []);

  return (
    <div className="card text-center">
      <div className="card-header">
        <div className="d-flex justify-content-center">
          <div className="d-flex align-items-center me-3">
            <BsArrowLeftSquareFill className="me-1" /> Absen Keluar
          </div>
          <div className="d-flex align-items-center me-3 ms-3">
            <BsClockFill className="me-1" /> {hours}:{minutes}
          </div>
          <div className="d-flex align-items-center ms-3">
            <BsCalendar2Fill className="me-1" /> {dayString()} {date}/
            {monthString()}/{year}
          </div>
        </div>
      </div>
      <div className="card-body">
        <button onClick={confirmOut} className="btn btn-primary w-100 m-1">
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
