import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ModalSetting() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [defaultPass, setDefaultPass] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [radius, setRadius] = useState(0);
  const [lateLimit, setLateLimit] = useState(0);
  const [wfhLimit, setWfhLimit] = useState(0);
  const [leavesLimit, setLeavesLimit] = useState(0);
  const [enableWfh, setEnableWfh] = useState(true);
  const [usingShot, setUsingShot] = useState(true);

  const getSetting = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/setting",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setRadius(data.data.office_radius);
        setLatitude(data.data.office_latitude);
        setLongitude(data.data.office_longitude);
        setAddress(data.data.office_address);
        setName(data.data.office_name);
        setDefaultPass(data.data.default_password);
        setLateLimit(data.data.minute_late_limit);
        setLeavesLimit(data.data.leaves_limit);
        setWfhLimit(data.data.wfh_limit);
        setEnableWfh(data.data.enable_wfh);
        setUsingShot(data.data.using_shot);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const simpanPengaturan = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/setting",
        {
          office_radius: radius,
          office_latitude: latitude,
          office_longitude: longitude,
          office_address: address,
          office_name: name,
          default_password: defaultPass,
          minute_late_limit: lateLimit,
          wfh_limit: wfhLimit,
          leaves_limit: leavesLimit,
          enable_wfh: enableWfh,
          using_shot: usingShot,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.data) {
        console.log(data.data);
        Swal.fire({
          title: "Perubahan berhasil disimpan!",
          icon: "success",
          background: "#555555",
          color: "#FFFFFF",
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          position: "center",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      Swal.fire({
        title: "Ops! Perubahan gagal disimpan",
        text: "Mohon maaf atas kendala yang terjadi, mohon untuk mencoba kembali lain waktu dan silahkan hubungi admin",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div className="d-inline ms-3">
      <a
        className="stretched-link"
        style={{ color: "white", cursor: "pointer" }}
        data-bs-toggle="modal"
        data-bs-target="#settingModal"
      >
        Pengaturan Aplikasi
      </a>

      <div
        className="modal fade"
        id="settingModal"
        tabIndex="-1"
        aria-labelledby="settingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="settingModalLabel">
                Pengaturan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form method="post" onSubmit={simpanPengaturan}>
                <div className="row">
                  <div className="col">
                    <div className="mb-3">
                      <label
                        for="exampleFormControlInput1"
                        className="form-label"
                      >
                        Nama perusahaan
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="office-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="office-address" className="form-label">
                        Alamat perusahaan
                      </label>
                      <textarea
                        className="form-control"
                        id="office-address"
                        rows="9"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label for="office-latitude" className="form-label">
                        Koordinat Latitude kantor
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="office-latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="office-longitude" className="form-label">
                        Koordinat Longitude kantor
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="office-longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="office-radius" className="form-label">
                        Zona absensi (Radius dalam meter)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="office-radius"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="default-password" className="form-label">
                        Password default (untuk pengguna baru)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="default-password"
                        value={defaultPass}
                        onChange={(e) => setDefaultPass(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label for="minute-late-limit" className="form-label">
                        Toleransi waktu terlambat (menit)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="minute-late-limit"
                        value={lateLimit}
                        onChange={(e) => setLateLimit(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="wfh-limit" className="form-label">
                        Batas WFH dalam 1 bulan
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="wfh-limit"
                        value={wfhLimit}
                        onChange={(e) => setWfhLimit(e.target.value)}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label for="leaves-limit" className="form-label">
                        Batas Cuti dalam 1 tahun
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="leaves-limit"
                        value={leavesLimit}
                        onChange={(e) => setLeavesLimit(e.target.value)}
                      ></input>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="using-shot"
                        checked={usingShot}
                        onChange={(e) => setUsingShot(e.target.checked)}
                      ></input>
                      <label className="form-check-label" for="using-shot">
                        Gunakan Shot (2 langkah validasi absensi)
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="enable-wfh"
                        checked={enableWfh}
                        onChange={(e) => setEnableWfh(e.target.checked)}
                      ></input>
                      <label className="form-check-label" for="enable-wfh">
                        Izinkan Work From Home
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-4">
                  Simpan perubahan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
