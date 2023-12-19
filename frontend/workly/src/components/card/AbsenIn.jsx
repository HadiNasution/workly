import { useState, useEffect } from "react";
import { BsGeoAltFill } from "react-icons/bs";
import { generate } from "random-words";

export default function AbsenIn() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [shot, setShot] = useState(localStorage.getItem("shot"));
  const [counter, setCounter] = useState(2);
  const [countdown, setCountdown] = useState(null);
  let warning;

  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  function shuffleLinks() {
    const linkContainer = document.querySelector(".shot");
    const links = Array.from(linkContainer.children);

    const shuffledLinks = shuffleArray(links);

    shuffledLinks.forEach((link) => {
      linkContainer.appendChild(link);
    });
  }

  const repeatAbsen = () => {
    setCounter(counter - 1);
  };

  // logic untuk set warning jika absen salah
  if (counter === 2) {
    warning = "";
  } else if (counter === 1) {
    warning = (
      <div className="bg-warning text-dark rounded mt-3 p-2 ">
        ⛔ shot salah, kesempatan absen tersisa {counter}x lagi.
      </div>
    );
  } else {
    warning = (
      <h2>
        Absen kembali dalam:{" "}
        <b>
          {Math.floor(countdown / 60)}:{countdown % 60}
        </b>
      </h2>
    );
  }

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

    const shotInterval = setInterval(() => {
      // Mendapatkan nilai terkini dari local storage
      const currentValue = localStorage.getItem("shot");

      // apakah nilai berubah sejak update sebelumnya
      if (currentValue !== shot) {
        // Mengupdate state jika nilai berubah
        setShot(currentValue);
        // acak tombol
        shuffleLinks();
      }
    }, 1000); // Setiap detik

    let countDownInterval;

    if (counter === 0) {
      setCountdown(5); // Hitungan mundur selama 10 menit (dalam detik)

      countDownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(countDownInterval);
            setCounter(2); // Set counter kembali ke 2 setelah hitungan mundur selesai
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    getPosition(); // ambil koordinat saat kopmponen pertamakali dirender
    shuffleLinks(); // acak saat komponen pertama kali di render

    return () => {
      clearInterval(shotInterval);
      clearInterval(countDownInterval);
    };
  }, [counter, shot]);

  return (
    <div className="card text-center">
      <div className="card-header">
        Absen Masuk - <span style={{ color: "yellow" }}>Belum absen</span>
      </div>
      <div className="card-body">
        <h5 className="card-title" hidden={counter === 0}>
          Pilih kata yang muncul di layar
        </h5>
        <div className="shot d-flex justify-content-around mt-4">
          <button
            className="btn btn-secondary w-100 m-1"
            hidden={counter === 0}
          >
            {shot}
          </button>
          <button
            onClick={repeatAbsen}
            className="btn btn-secondary w-100 m-1"
            hidden={counter === 0}
          >
            {generate({ minLength: 3, maxLength: 10 }).toUpperCase()}
          </button>
          <button
            onClick={repeatAbsen}
            className="btn btn-secondary w-100 m-1"
            hidden={counter === 0}
          >
            {generate({ minLength: 3, maxLength: 10 }).toUpperCase()}
          </button>
        </div>
        {warning}
      </div>
      <div className="card-footer text-body-secondary">
        {latitude && longitude ? (
          <p style={{ color: "#11f227" }}>
            <BsGeoAltFill className="me-1" />
            Lokasi aktif
          </p>
        ) : (
          <p style={{ color: "#e00727" }}>Lokasi tidak aktif</p>
        )}
      </div>
    </div>
  );
}
