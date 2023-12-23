import { useState, useEffect } from "react";
import {
  BsGeoAltFill,
  BsCalendar2Fill,
  BsClockFill,
  BsArrowRightSquareFill,
} from "react-icons/bs";
import { generate } from "random-words";
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

export default function AbsenIn({ onLogin }) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [shot, setShot] = useState(localStorage.getItem("shot"));
  const [counter, setCounter] = useState(2);
  const [countdown, setCountdown] = useState(null);
  const [wfh, setWfh] = useState(false);
  const [enableWfh, setEnableWfh] = useState(true);
  const [usingShot, setUsingShot] = useState(true);
  let warning;
  let countDownInterval;

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

  const getSetting = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/employee/setting",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setEnableWfh(data.data.enable_wfh);
        setUsingShot(data.data.using_shot);
      }
    } catch (error) {
      console.log(error);
    }
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

  const absenIn = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/employee/absenIn/${latitude}/${longitude}/${wfh}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "Absen masuk berhasil!",
        icon: "success",
        background: "#555555",
        color: "#FFFFFF",
        timer: 3000, // Durasi dalam milidetik
        timerProgressBar: true,
        toast: true,
        position: "center",
      });
      onLogin(); // set state login di parent, agar card absen in diganti card absen out
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Absen masuk gagal!",
        text: "Pastikan akses lokasi disitus ini sudah diizinkan",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

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

  useEffect(() => {
    // fungsi untuk cek setiap detik
    const shotInterval = setInterval(() => {
      // Mendapatkan nilai terkini dari local storage
      const currentValue = localStorage.getItem("shot");
      // mendapatkan nilai terkini dari checkbox wfh
      const value = document.getElementById("wfh");
      // dapatkan nilai wfh
      setWfh(value.checked);
      // apakah nilai berubah sejak update sebelumnya
      if (currentValue !== shot) {
        // Mengupdate state jika nilai berubah
        setShot(currentValue);
        // acak tombol
        shuffleLinks();
      }
    }, 1000); // Setiap detik

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
    getSetting();

    return () => {
      clearInterval(shotInterval);
      clearInterval(countDownInterval);
    };
  }, [counter, shot]);

  return (
    <div className="card text-center">
      <div className="card-header">
        <div className="d-flex justify-content-center">
          <div className="d-flex align-items-center me-3">
            <BsArrowRightSquareFill className="me-1" /> Absen Masuk
          </div>
          <div className="d-flex align-items-center me-3 ms-3">
            <BsClockFill className="me-1" /> {hours}:{minutes}
          </div>
          <div className="d-flex align-items-center ms-3">
            <BsCalendar2Fill className="me-1" /> {dayString()} {date}/
            {monthString()}/{year}
          </div>
        </div>
        <div className="form-switch mt-2">
          <input
            className="form-check-input me-2"
            type="checkbox"
            role="switch"
            id="wfh"
            hidden={!enableWfh}
          ></input>
          <label className="form-check-label" for="wfh" hidden={!enableWfh}>
            WFH
          </label>
        </div>
      </div>
      <div className="card-body">
        {usingShot ? (
          <div className="using-shot">
            <h5 className="card-title" hidden={counter === 0 || wfh}>
              Pilih kata yang muncul di layar
            </h5>
            <div className="shot d-flex justify-content-around mt-4">
              <button
                onClick={absenIn}
                className="btn btn-secondary w-100 m-1"
                hidden={counter === 0 || wfh}
              >
                {shot}
              </button>
              <button
                onClick={() => setCounter(counter - 1)}
                className="btn btn-secondary w-100 m-1"
                hidden={counter === 0 || wfh}
              >
                {generate({ minLength: 3, maxLength: 10 }).toUpperCase()}
              </button>
              <button
                onClick={() => setCounter(counter - 1)}
                className="btn btn-secondary w-100 m-1"
                hidden={counter === 0 || wfh}
              >
                {generate({ minLength: 3, maxLength: 10 }).toUpperCase()}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={absenIn} className="btn btn-primary w-100 m-1">
            Absen Masuk
          </button>
        )}
        {warning}
        {wfh ? (
          <button onClick={absenIn} className="btn btn-primary w-100 m-1">
            Absen Masuk WFH
          </button>
        ) : null}
      </div>
      <div className="card-footer text-body-secondary">
        {latitude && longitude ? (
          <p style={{ color: "#11f227" }}>
            <BsGeoAltFill className="me-1" />
            Lokasi aktif
          </p>
        ) : (
          <p style={{ color: "#dc3545" }}>
            Lokasi tidak aktif, izinkan akses lokasi dibrowser untuk situs ini
            atau periksa koneksi internet
          </p>
        )}
      </div>
    </div>
  );
}
