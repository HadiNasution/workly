import { useState, useEffect } from "react";
import { BsGeoAltFill } from "react-icons/bs";
import axios from "axios";
import Swal from "sweetalert2";

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
          timer: 3000, // Durasi dalam milidetik (3 detik)
          timerProgressBar: true,
          toast: true, // Menandakan bahwa ini adalah toast
          position: "center", // Posisi toast (top-end, top-start, bottom-end, atau bottom-start)
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
      onLogin(false);
    } catch (error) {
      console.log(error);
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
        Absen Keluar - <span style={{ color: "yellow" }}>Belum absen</span>
      </div>
      <div className="card-body">
        <h5 className="card-title">Pilih kata yang muncul di layar</h5>
        <div className="shot d-flex justify-content-around mt-4">
          <button onClick={confirmOut} className="btn btn-primary w-100 m-1">
            Absen keluar
          </button>
        </div>
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
          </p>
        )}
      </div>
    </div>
  );
}
