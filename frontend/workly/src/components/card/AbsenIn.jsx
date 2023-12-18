import { useState, useEffect, useContext } from "react";
import { BsGeoAltFill } from "react-icons/bs";
import { EmployeeContext } from "../../context/context-provider.jsx";

export default function AbsenIn() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { shot, setShot } = useContext(EmployeeContext);
  let storedShot;
  const getShot = () => {
    storedShot = shot;
  };

  // get koordinat latitude longitude
  useEffect(() => {
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

    getPosition(); // dapatkan posisi saat komponen di-mount

    const intervalId = setInterval(() => {
      // getShot setiap 1 menit
      getShot();
    }, 60000);

    getShot();

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="card text-center">
      <div className="card-header">
        Absen Masuk - <span style={{ color: "yellow" }}>Belum absen</span>
      </div>
      <div className="card-body">
        <h5 className="card-title">Pilih kata yang muncul di layar</h5>
        <div className="d-flex justify-content-around mt-4">
          <a href="#" className="btn btn-secondary w-100 m-1">
            {storedShot}
          </a>
          <a href="#" className="btn btn-secondary w-100 m-1">
            Word 2
          </a>
          <a href="#" className="btn btn-secondary w-100 m-1">
            Word 3
          </a>
        </div>
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
