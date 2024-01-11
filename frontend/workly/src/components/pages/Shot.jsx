import { useState, useEffect } from "react";
import { axiosPut } from "../../controller/api-controller";
import { alertError } from "../alert/SweetAlert";

export default function Shot() {
  const [shot, setShot] = useState("");
  const [countdown, setCountdown] = useState(10); // Waktu mundur dalam detik

  const generateShot = () => {
    axiosPut(`http://localhost:3000/api/shot/generate`)
      .then((result) => {
        setShot(result.shot.toUpperCase());
        setCountdown(10); // Mengatur ulang waktu mundur setelah generateShot (dalam detik)
      })
      .catch((error) => {
        console.error("Get shot failed : ", error);
        alertError("Gagal generate shot", error);
      });
  };

  useEffect(() => {
    // Fungsi untuk mengurangi waktu mundur setiap detik
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Fungsi untuk menjalankan generateShot setiap 30 detik (dalam milidetik)
    const intervalId = setInterval(() => {
      generateShot();
    }, 10000);
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
