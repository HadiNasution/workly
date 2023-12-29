import { Navigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Permission from "../cards/Permission";

export default function ManagePermission() {
  const goBack = () => {
    window.history.back() ?? Navigate("/");
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="d-flex align-items-center">
            <BsArrowLeft className="me-1" color="black" />
            <button
              type="button"
              className="btn btn-link text-start"
              style={{ textDecoration: "none" }}
              onClick={goBack}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3 d-flex align-items-center">
        <div className="col">
          <h1>Kelola ajuan</h1>
          <p>Tambah, Update, Hapus dan Detail ajuan</p>
        </div>
        <div className="col text-end">
          <button className="btn btn-primary w-75"> Tambah ajuan</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Permission />
        </div>
      </div>
    </>
  );
}
