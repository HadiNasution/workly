import { axiosGet } from "../../controller/api-controller";
import axios from "axios";
import { useState, useEffect } from "react";
import { toastSuccess, alertError } from "../alert/SweetAlert";

export default function ModalSetting() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [defaultPass, setDefaultPass] = useState("");
  const [timeIn, setTimeIn] = useState(0);
  const [timeOut, setTimeOut] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [radius, setRadius] = useState(0);
  const [lateLimit, setLateLimit] = useState(0);
  const [wfhLimit, setWfhLimit] = useState(0);
  const [leavesLimit, setLeavesLimit] = useState(0);
  const [enableWfh, setEnableWfh] = useState(true);
  const [usingShot, setUsingShot] = useState(true);
  const token = sessionStorage.getItem("token");

  const getSetting = () => {
    axiosGet("http://localhost:3000/api/admin/setting", token)
      .then((result) => {
        setRadius(result.office_radius);
        setLatitude(result.office_latitude);
        setLongitude(result.office_longitude);
        setAddress(result.office_address);
        setName(result.office_name);
        setDefaultPass(result.default_password);
        setTimeIn(result.time_in);
        setTimeOut(result.time_out);
        setLateLimit(result.minute_late_limit);
        setLeavesLimit(result.leaves_limit);
        setWfhLimit(result.wfh_limit);
        setEnableWfh(result.enable_wfh);
        setUsingShot(result.using_shot);
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
      });
  };

  const simpanPengaturan = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/setting",
        {
          office_radius: radius,
          office_latitude: latitude,
          office_longitude: longitude,
          office_address: address,
          office_name: name,
          default_password: defaultPass,
          time_in: timeIn,
          time_out: timeOut,
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
        toastSuccess(
          "Perubahan berhasil disimpan!",
          "Sekarang pengguna akan menggunakan pengaturan baru"
        );
      }
    } catch (error) {
      console.error("Server Response:", error.response.data.errors);
      alertError("Oops! Perubahan gagal disimpan", error.response.data.errors);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div className="d-inline ms-2">
      <a
        className="stretched-link"
        style={{ color: "white", cursor: "pointer" }}
        data-bs-toggle="modal"
        data-bs-target="#settingModal"
      >
        Pengaturan
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
                        htmlFor="exampleFormControlInput1"
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
                      <label htmlFor="office-address" className="form-label">
                        Alamat perusahaan
                      </label>
                      <textarea
                        className="form-control"
                        id="office-address"
                        rows="4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="default-password" className="form-label">
                        Password default
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="default-password"
                        value={defaultPass}
                        onChange={(e) => setDefaultPass(e.target.value)}
                      ></input>
                      <div id="passwordHelpBlock" className="form-text">
                        untuk pengguna baru
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label htmlFor="office-latitude" className="form-label">
                        Koordinat Latitude kantor
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        id="office-latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      ></input>
                      <div id="passwordHelpBlock" className="form-text">
                        gunakan titik, bukan koma
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="office-longitude" className="form-label">
                        Koordinat Longitude kantor
                      </label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        id="office-longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      ></input>
                      <div id="passwordHelpBlock" className="form-text">
                        gunakan titik, bukan koma
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="office-radius" className="form-label">
                        Zona radius absensi
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          id="office-radius"
                          value={radius}
                          onChange={(e) => setRadius(e.target.value)}
                        ></input>
                        <span className="input-group-text" id="basic-addon2">
                          meter
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label htmlFor="minute-late-limit" className="form-label">
                        Toleransi waktu terlambat
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          id="minute-late-limit"
                          value={lateLimit}
                          onChange={(e) => setLateLimit(e.target.value)}
                        ></input>
                        <span className="input-group-text" id="basic-addon2">
                          menit
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Jam masuk
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="time-in"
                            value={timeIn}
                            onChange={(e) => setTimeIn(e.target.value)}
                          ></input>
                        </div>
                        <div className="col">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Jam keluar
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="time-out"
                            value={timeOut}
                            onChange={(e) => setTimeOut(e.target.value)}
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col">
                          <label htmlFor="wfh-limit" className="form-label">
                            WFH dalam 1 bulan
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              id="wfh-limit"
                              value={wfhLimit}
                              onChange={(e) => setWfhLimit(e.target.value)}
                            ></input>
                            <span
                              className="input-group-text"
                              id="basic-addon2"
                            >
                              x
                            </span>
                          </div>
                        </div>
                        <div className="col">
                          <label htmlFor="leaves-limit" className="form-label">
                            Cuti dalam 1 tahun
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              id="leaves-limit"
                              value={leavesLimit}
                              onChange={(e) => setLeavesLimit(e.target.value)}
                            ></input>
                            <span
                              className="input-group-text"
                              id="basic-addon2"
                            >
                              x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-check form-switch form-check-reverse">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="using-shot"
                        checked={usingShot}
                        onChange={(e) => setUsingShot(e.target.checked)}
                      ></input>
                      <label className="form-check-label" htmlFor="using-shot">
                        Gunakan Shot (2 langkah validasi absensi)
                      </label>
                    </div>
                    <div className="form-check form-switch form-check-reverse">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="enable-wfh"
                        checked={enableWfh}
                        onChange={(e) => setEnableWfh(e.target.checked)}
                      ></input>
                      <label className="form-check-label" htmlFor="enable-wfh">
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
