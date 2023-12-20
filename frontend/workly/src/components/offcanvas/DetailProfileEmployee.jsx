import { monthString, year } from "../../utils/date-time";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function DetailProfileEmployee() {
  let avatar = localStorage.getItem("avatar") ?? null;
  if (avatar === "null") avatar = null;
  const [profile, setProfile] = useState(null);

  let avatarPath = avatar
    ? `http://localhost:3000/${avatar}`
    : "/assets/avatar-default.svg";

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
        // console.log(data.data);
        setProfile(data.data);
        // console.log(profile[0]);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Ops! Masalah teknis",
        text: "Mohon maaf atas kendala yang terjadi, mohon untuk mencoba kembali lain waktu dan silahkan hubungi admin",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  const updateFotoProfile = async () => {
    const path = document.getElementById("profile-photo");
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/employee/upload",
        {
          profilePhoto: path.values,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        // console.log(data.data);
        setProfile(data.data);
        // console.log(profile[0]);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Upload gagal!",
        text: "Format file tidak didukung, pastikan menggunakan format : JPG, JPEG, PNG",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
      Navigate("/employee/home");
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
        localStorage.removeItem("name");
        localStorage.removeItem("avatar");
        localStorage.removeItem("shot");
        // lalu redirect ke halaman login
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <a
        data-bs-toggle="offcanvas"
        href="#offcanvasProfile"
        role="button"
        aria-controls="offcanvasProfile"
      >
        <img
          src={avatarPath}
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
              src={avatarPath}
              alt="foto-profile"
              className="rounded-circle me-3"
              width={100}
              height={100}
              style={{ cursor: "pointer" }}
            />
            <form className="mb-3" onSubmit={updateFotoProfile} method="post">
              <label
                for="foto-profile"
                className="form-label"
                style={{ color: "gray" }}
              >
                Upload foto profile
              </label>
              <input
                className="form-control"
                type="file"
                name="foto-profile"
                id="foto-profile"
              ></input>
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
              <p>
                <b>NIP : </b>
                {profile[0].nip ?? <i>Data masih kosong</i>}
                <br></br>
                <b>Email : </b>
                {profile[0].email ?? <i>Data masih kosong</i>}
                <br></br>
                <b>Role : </b>
                {profile[0].role ?? <i>Data masih kosong</i>}
                <br></br>
                <b>Departmen : </b>{" "}
                {profile[0].departmen ?? <i>Data masih kosong</i>}
              </p>
              <p>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "gray",
                    fontSize: 18,
                  }}
                >
                  Recap kehadiran bulan {monthString()}/{year}
                </span>{" "}
                <br></br>
                <b>Terlambat : </b>{" "}
                {profile[0].count_late ?? <i>Data masih kosong</i>}x<br></br>
                <b>Sakit : </b>{" "}
                {profile[0].count_sick ?? <i>Data masih kosong</i>}x<br></br>
                <b>Izin : </b>{" "}
                {profile[0].count_permits ?? <i>Data masih kosong</i>}x<br></br>
                <b>Cuti : </b>{" "}
                {profile[0].count_leaves ?? <i>Data masih kosong</i>}/12
                <br></br>
                <b>WFH : </b> {profile[0].count_wfh ?? <i>Data masih kosong</i>}
                /4
                <br></br>
                <b>Kerja :</b>{" "}
                {profile[0].count_works ?? <i>Data masih kosong</i>}
              </p>
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
