import { dateFormat, monthString, year } from "../../utils/date-time";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosGet, axiosDelete } from "../../controller/api-controller";
import { toastSuccess, alertError } from "../alert/SweetAlert";

export default function DetailProfileEmployee() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [pict, setPict] = useState(localStorage.getItem("avatar"));
  const [wfhLimit, setWfhLimit] = useState(0);
  const [leavesLimit, setLeavesLimit] = useState(0);
  const token = sessionStorage.getItem("token");

  let isPictNull;
  if (pict === "null") {
    isPictNull = true;
  } else {
    isPictNull = false;
  }

  const getSetting = () => {
    axiosGet("http://localhost:3000/api/employee/setting", token)
      .then((result) => {
        setWfhLimit(result.wfh_limit);
        setLeavesLimit(result.leaves_limit);
      })
      .catch((error) => {
        console.error("Get setting failed : ", error);
        toastWarning("Data admin tidak ditemukan");
      });
  };

  const getProfile = () => {
    axiosGet("http://localhost:3000/api/employee/profile", token)
      .then((result) => {
        setProfile(result);
        localStorage.setItem("avatar", result[0].picture);
      })
      .catch((error) => {
        console.error("Get profile failed : ", error);
      });
  };

  const updateFotoProfile = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("profile");
    const file = fileInput.files[0];
    try {
      const formData = new FormData();
      formData.append("profile", file);
      const { data } = await axios.post(
        "http://localhost:3000/api/employee/upload",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.data) {
        setPict(data.data.picture);
        toastSuccess(
          "Foto berhasil disimpan!",
          "Dengan foto baru ini,kamu jadi terlihat lebih baik"
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data.errors);
      }
      alertError("Oops! Foto gagal disimpan", error.response.data.errors);
    }
  };

  const gantiPassword = async (event) => {
    event.preventDefault();
    const newPass = document.getElementById("password").value;
    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/employee/change/password",
        {
          password: newPass,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        toastSuccess(data.data, "");
      }
    } catch (error) {
      console.error("Server Response:", error);
      if (error.response) {
        alertError("Oops! Gagal ganti password", error.response.data.errors);
      }
    }
    document.getElementById("password").value = "";
  };

  const logoutEmployee = () => {
    axiosDelete("http://localhost:3000/api/employee/logout", token)
      .then((result) => {
        sessionStorage.clear();
        localStorage.clear();
        toastSuccess("See you!", "");
        // lalu redirect ke halaman login
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed : ", error);
      });
  };

  useEffect(() => {
    getProfile();
    getSetting();
  }, [pict]);

  return (
    <>
      <a
        data-bs-toggle="offcanvas"
        href="#offcanvasProfile"
        role="button"
        aria-controls="offcanvasProfile"
      >
        <img
          src={
            isPictNull
              ? "/assets/avatar-default.svg"
              : `http://localhost:3000/${pict}`
          }
          alt="foto-profile"
          className="profile rounded-circle"
          width={70}
          height={70}
          style={{ cursor: "pointer", objectFit: "cover" }}
        />
      </a>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasProfile"
        aria-labelledby="offcanvasProfileLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title"
            id="offcanvasProfileLabel"
            style={{ color: "gray" }}
          >
            Profile
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body text-start">
          <div className="head text-center">
            <img
              src={
                isPictNull
                  ? "/assets/avatar-default.svg"
                  : `http://localhost:3000/${pict}`
              }
              alt="foto-profile"
              className="profile rounded-circle"
              width={100}
              height={100}
              style={{ cursor: "pointer", objectFit: "cover" }}
            />
            {profile ? (
              <h3 style={{ fontWeight: "bolder" }} className="mt-3 mb-3">
                {profile[0].name ?? <i>Data masih kosong</i>}
              </h3>
            ) : null}
          </div>
          {profile ? (
            <div className="profile mt-2">
              <div className="d-flex justify-content-between">
                <p>
                  <b>NIP : </b>
                </p>
                <p> {profile[0].nip ?? <i>Data masih kosong</i>}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Email : </b>
                </p>
                <p>{profile[0].email ?? <i>Data masih kosong</i>}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Role : </b>
                </p>
                <p>{profile[0].role ?? <i>Data masih kosong</i>}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Departmen : </b>
                </p>
                <p>{profile[0].departmen ?? <i>Data masih kosong</i>}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Tanggal bergabung : </b>
                </p>
                <p>
                  {dateFormat(profile[0].join_date) ?? <i>Data masih kosong</i>}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Jatuh tempo kontrak : </b>
                </p>
                <p>
                  {dateFormat(profile[0].quit_date) ?? <i>Data masih kosong</i>}
                </p>
              </div>
              <p className="mt-4" style={{ fontWeight: "bold", fontSize: 16 }}>
                Recap kehadiran bulan {monthString()}/{year}
              </p>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Terlambat : </b>
                </p>
                <p>{profile[0].count_late ?? <i>Data masih kosong</i>}x</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Sakit : </b>
                </p>
                <p>{profile[0].count_sick ?? <i>Data masih kosong</i>}x</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Izin : </b>
                </p>
                <p> {profile[0].count_permits ?? <i>Data masih kosong</i>}x</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Cuti : </b>
                </p>
                <p>
                  {" "}
                  {profile[0].count_leaves ?? <i>Data masih kosong</i>}/
                  {leavesLimit}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>WFH : </b>
                </p>
                <p>
                  {" "}
                  {profile[0].count_wfh ?? <i>Data masih kosong</i>}/{wfhLimit}
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>
                  <b>Total hari kerja : </b>
                </p>
                <p>
                  {" "}
                  {profile[0].count_works ?? <i>Data masih kosong</i>} hari
                </p>
              </div>
            </div>
          ) : null}
          <form
            className="mb-3 mt-4"
            onSubmit={updateFotoProfile}
            encType="multipart/form-data"
          >
            <label style={{ fontWeight: "bold", fontSize: 16 }}>
              Upload foto profile
            </label>
            <input
              className="form-control"
              type="file"
              name="profile"
              id="profile"
            />
            <button
              className="btn btn-secondary btn-sm w-100 mt-1"
              type="submit"
            >
              Ganti foto
            </button>
          </form>
          <form className="mb-3 mt-4" onSubmit={gantiPassword}>
            <label style={{ fontWeight: "bold", fontSize: 16 }}>
              Ganti password
            </label>
            <input
              className="form-control"
              type="password"
              placeholder="Password baru"
              name="password"
              id="password"
            />
            <button
              className="btn btn-secondary btn-sm w-100 mt-1"
              type="submit"
            >
              Ganti password
            </button>
          </form>
          <button
            onClick={logoutEmployee}
            className="btn btn-danger w-100 mt-3"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
