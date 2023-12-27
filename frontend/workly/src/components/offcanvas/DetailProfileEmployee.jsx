import { convertDayString, monthString, year } from "../../utils/date-time";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toastSuccess, alertError } from "../alert/SweetAlert";

export default function DetailProfileEmployee() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [pict, setPict] = useState(localStorage.getItem("avatar"));
  const [wfhLimit, setWfhLimit] = useState(0);
  const [leavesLimit, setLeavesLimit] = useState(0);

  let isPictNull;
  if (pict === "null") {
    isPictNull = true;
  } else {
    isPictNull = false;
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
        setWfhLimit(data.data.wfh_limit);
        setLeavesLimit(data.data.leaves_limit);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/employee/profile",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setProfile(data.data);
        localStorage.setItem("avatar", data.data[0].picture);
      }
    } catch (error) {}
  };

  const updateFotoProfile = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("profile");
    const file = fileInput.files[0];
    const token = sessionStorage.getItem("token");
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

  const logoutEmployee = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(
        "http://localhost:3000/api/employee/logout",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      // Jika logout berhasil, hapus token dari session storage
      if (data.data) {
        sessionStorage.clear();
        localStorage.clear();
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  const dateFormat = (date) => {
    let dateString = date;
    let dateObject = new Date(dateString);

    let hari = convertDayString(dateObject);
    let tanggal = dateObject.getDate();
    let bulan = dateObject.getMonth() + 1;
    let tahun = dateObject.getFullYear();

    let formatWaktu = `${hari} ${tanggal}/${bulan}/${tahun}`;
    return formatWaktu;
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
          className="rounded-circle"
          width={60}
          height={60}
          style={{ cursor: "pointer" }}
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
          <div className="d-flex align-items-center">
            <img
              src={
                isPictNull
                  ? "/assets/avatar-default.svg"
                  : `http://localhost:3000/${pict}`
              }
              alt="foto-profile"
              className="rounded-circle me-3"
              width={100}
              height={100}
              style={{ cursor: "pointer" }}
            />
            <form
              className="mb-3"
              onSubmit={updateFotoProfile}
              encType="multipart/form-data"
            >
              <label>Upload foto profile</label>
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
          </div>
          {profile ? (
            <div className="profile mt-2">
              <h3 style={{ fontWeight: "bolder" }}>
                {profile[0].name ?? <i>Data masih kosong</i>}
              </h3>
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
                  <b>Tanggal masuk : </b>
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
              <p className="mt-4">
                <span
                  style={{
                    fontWeight: "bold",
                    color: "gray",
                    fontSize: 16,
                  }}
                >
                  Recap kehadiran bulan {monthString()}/{year}
                </span>
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
          <button
            onClick={logoutEmployee}
            className="btn btn-danger w-100 mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
