import { Navigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Admin from "../cards/Admin";
import ModalTambahAdmin from "../modals/ModalTambahAdmin";

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
      <div className="row mt-3 mb-2 d-flex align-items-center">
        <div className="col">
          <h1>Kelola admin</h1>
          <h5 className="text-secondary">
            Tambah, Update, Hapus dan Informasi admin
          </h5>
        </div>
        <div className="col text-end">
          <ModalTambahAdmin />
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
