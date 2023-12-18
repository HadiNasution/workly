import { generate } from "random-words";
import { useState, useEffect, useContext } from "react";
import { EmployeeContext } from "../../context/context-provider.jsx";

export default function Shot() {
  const { shot, setShot } = useContext(EmployeeContext);
  const [countdown, setCountdown] = useState(60); // Waktu mundur dalam detik

  const generateShot = () => {
    const randomWord = generate({ minLength: 3, maxLength: 10 });
    setShot(randomWord.toUpperCase());
    // localStorage.setItem("shot", randomWord.toUpperCase());
    setCountdown(60); // Mengatur ulang waktu mundur setelah generateShot
  };

  useEffect(() => {
    // Fungsi untuk mengurangi waktu mundur setiap detik
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Fungsi untuk menjalankan generateShot setiap 1 menit (60,000 milidetik)
    const intervalId = setInterval(() => {
      generateShot();
    }, 60000);
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
      <div className="card-header">Absen Workly ☕</div>
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
