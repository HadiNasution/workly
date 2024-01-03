import { useState, useEffect } from "react";
import axios from "axios";
import { alertError } from "../alert/SweetAlert";

export default function Shot() {
  const [shot, setShot] = useState(null);
  const [countdown, setCountdown] = useState(30); // Waktu mundur dalam detik

  const generateShot = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/shot/generate`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShot(data.data.shot.toUpperCase());
      setCountdown(30); // Mengatur ulang waktu mundur setelah generateShot (dalam detik)
    } catch (error) {
      console.log(error);
      alertError("Gagal generate shot", error);
    }
  };

  useEffect(() => {
    // Fungsi untuk mengurangi waktu mundur setiap detik
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Fungsi untuk menjalankan generateShot setiap 30 detik (dalam milidetik)
    const intervalId = setInterval(() => {
      generateShot();
    }, 30000);
    generateShot();
    // Membersihkan interval saat komponen di-unmount atau selesai
    return () => {
      clearInterval(countdownInterval);
      clearInterval(intervalId);
    };
  }, []);

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="card text-center">
      <div className="card-header">
        <strong>Absen Workly</strong> ☕
      </div>
      <div className="card-body">
        <h1 className="card-title fw-bolder">{shot}</h1>
      </div>
      <div className="card-footer">
        Shot akan diganti dalam{" "}
        <span className="fw-bold">{formatCountdown()}</span>
      </div>
    </div>
  );
}
