import { Navigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Admin from "../cards/Admin";

export default function ManageAdmin() {
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
          <h1>Kelola admin</h1>
          <p>Tambah, Update, Hapus dan Detail admin</p>
        </div>
        <div className="col text-end">
          <button className="btn btn-primary w-75"> Tambah admin</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Admin />
        </div>
      </div>
    </>
  );
}
