import { useState, useEffect } from "react";
import {
  BsCalendar2Fill,
  BsClockFill,
  BsArrowRightSquareFill,
} from "react-icons/bs";
import { generate } from "random-words";
import { toastSuccess, alertError, toastWarning } from "../alert/SweetAlert";
import { dayString, monthString, date, year } from "../../utils/date-time";
import { axiosGet } from "../../controller/api-controller";

export default function AbsenIn({ onLogin }) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [shot, setShot] = useState("");
  const [oldShot, setOldShot] = useState("");
  const [counter, setCounter] = useState(2);
  const [countdown, setCountdown] = useState(0);
  const [wfh, setWfh] = useState(false);
  const [enableWfh, setEnableWfh] = useState(true);
  const [usingShot, setUsingShot] = useState(true);
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const token = sessionStorage.getItem("token");
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

  const getSetting = () => {
    axiosGet("http://localhost:3000/api/employee/setting", token)
      .then((result) => {
        setEnableWfh(result.enable_wfh);
        setUsingShot(result.using_shot);
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
      });
  };

  const absenIn = () => {
    axiosGet(
      `http://localhost:3000/api/employee/absenIn/-6.935783427330478/107.5782643924172/${wfh}`,
      token
    )
      .then((result) => {
        toastSuccess(result, "Jangan lupa untuk absen keluar");
        onLogin(); // set state login di parent, agar card absen in diganti card absen out
      })
      .catch((error) => {
        console.error("Absen in failed : ", error);
        alertError("Gagal", error.response.data.errors);
      });
  };

  const getShot = () => {
    axiosGet(`http://localhost:3000/api/employee/shot`, token)
      .then((result) => {
        setShot(result.shot.toUpperCase());
      })
      .catch((error) => {
        console.error("Get shot failed ", error);
      });
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

  // get koordinat latitude longitude
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toastWarning("Gagal mendapatkan lokasi");
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
  console.log(latitude);
  console.log(longitude);

  useEffect(() => {
    // fungsi untuk cek state setiap detik
    const shotInterval = setInterval(() => {
      setHours(new Date().getHours());
      setMinutes(new Date().getMinutes());

      if (enableWfh) {
        // mendapatkan nilai terkini dari checkbox wfh
        const value = document.getElementById("wfh");
        // dapatkan nilai wfh
        setWfh(value.checked);
      }

      if (usingShot) {
        // Mendapatkan nilai terkini dari shot
        getShot();
      }
    }, 1000); // Setiap detik

    if (usingShot) {
      // jika state di databse berubah, maka update oldShot dan acak tombol
      if (oldShot !== shot) {
        // Mengupdate state jika nilai berubah
        setOldShot(shot);
        // acak tombol
        shuffleLinks();
      }

      // jika pengguna salah pilih shot selama 2x, maka mulai hitung
      if (counter === 0) {
        setCountdown(3600); // selama 1 jam (dalam detik)
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
    }

    getSetting();
    getPosition();
    setOldShot("");

    return () => {
      clearInterval(shotInterval);
      clearInterval(countDownInterval);
    };
  }, [counter, shot]);

  return (
    <div className="card text-center">
      <div className="card-header">
        <div className="timeIn d-flex justify-content-center mb-2">
          <div className="keterangan d-flex align-items-center me-3">
            <BsArrowRightSquareFill className="me-2 mb-1" color="blue" />
            Absen Masuk
          </div>
          <div className="waktu d-flex align-items-center me-3 ms-3">
            <BsClockFill className="me-2 mb-1" />
            {hours}:{minutes < 10 ? "0" : ""}
            {minutes}
          </div>
          <div className="tanggal d-flex align-items-center ms-3">
            <BsCalendar2Fill className="me-2 mb-1" />
            {dayString()} {date}/{monthString()}/{year}
          </div>
        </div>
        <div className="form-switch d-inline mt-3">
          <input
            className="form-check-input me-2"
            type="checkbox"
            role="switch"
            id="wfh"
            hidden={!enableWfh}
          ></input>
          <label
            className="form-check-label fw-bold"
            htmlFor="wfh"
            hidden={!enableWfh}
          >
            WFH
          </label>
        </div>
        {wfh ? (
          <div className="row">
            <div className="col">
              <i>
                Pastikan anda sudah mengajukan izin WFH sebelum melakukan absen
                WFH
              </i>
            </div>
          </div>
        ) : null}
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
          <button onClick={absenIn} className="btn btn-success w-100 m-1">
            Absen Masuk
          </button>
        )}
        {warning}
        {wfh ? (
          <button onClick={absenIn} className="btn btn-success w-100 m-1">
            Absen Masuk WFH
          </button>
        ) : null}
      </div>
      {latitude && longitude ? null : (
        <div className="card-footer text-body-secondary">
          <p style={{ color: "red" }}>
            Lokasi tidak aktif, izinkan akses lokasi dibrowser untuk situs ini
            atau periksa koneksi internet
          </p>
        </div>
      )}
    </div>
  );
}
