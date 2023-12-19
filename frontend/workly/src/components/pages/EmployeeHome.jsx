import axios from "axios";
import { useNavigate } from "react-router-dom";
import AbsenIn from "../card/AbsenIn";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../../auth/auth-login";
import AbsenOut from "../card/AbsenOut";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState(null);
  let avatar = localStorage.getItem("avatar") ?? null;

  if (avatar === "null") avatar = null; // ubah nilai string dari local storage ke bentuk boolean

  let avatarPath = avatar
    ? `http://localhost:3000/${avatar}`
    : "/assets/avatar-default.svg";

  useEffect(() => {
    // cek apakah token masih berlaku
    if (isTokenExpired()) {
      // jika sudah tidak berlaku, maka...
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("token-expires-at");
      localStorage.removeItem("name");
      localStorage.removeItem("avatar");
      navigate("/");
    }
    getProfile();
  }, [navigate]);

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
      // Jika logout berhasil, hapus token dari session storage
      if (data.data) {
        console.log(data.data);
        setProfile(data.data);
        console.log(profile[0]);
      }
    } catch (error) {
      console.log(error.response.data.errors);
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
      console.log(error.response.data.errors);
    }
  };

  const handleLoginState = (state) => {
    setIsLogin(state);
  };

  return (
    <>
      <div className="row g-0">
        <div className="text-start col-sm-6 col-md-8">
          <h1>Heyoo! {name} 🖐</h1>
        </div>
        <div className="text-end col-6 col-md-4">
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
              <h5 className="offcanvas-title" id="offcanvasProfileLabel">
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
              <img
                src={avatarPath}
                alt="foto-profile"
                className="rounded-circle m-2 d-flex"
                width={100}
                height={100}
                style={{ cursor: "pointer" }}
              />
              <h3>{profile[0].name ?? "Data masih kosong"}</h3>
              <p>{profile[0].nip ?? "Data masih kosong"}</p>
              <p>{profile[0].email ?? "Data masih kosong"}</p>
              <p>{profile[0].role ?? "Data masih kosong"}</p>
              <p>{profile[0].department ?? "Data masih kosong"}</p>
              <p>{profile[0].count_late ?? "Data masih kosong"}</p>
              <p>{profile[0].count_sick ?? "Data masih kosong"}</p>
              <p>{profile[0].count_permits ?? "Data masih kosong"}</p>
              <p>{profile[0].count_leaves ?? "Data masih kosong"}</p>
              <p>{profile[0].count_wfh ?? "Data masih kosong"}</p>
              <p>{profile[0].count_works ?? "Data masih kosong"}</p>
              <button
                onClick={logoutEmployee}
                className="btn btn-danger w-100 mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col">
          {isLogin ? (
            <AbsenOut onLogin={handleLoginState} />
          ) : (
            <AbsenIn onLogin={handleLoginState} />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              This is some text within a card body.
            </div>
          </div>
        </div>
        <div className="col-md mt-2">
          <div className="card">
            <div className="card-body">
              This is some text within a card body.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeHome;
