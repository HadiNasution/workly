import { Navigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Karyawan from "../cards/Karyawan";
import ModalTambahKaryawan from "../modals/ModalTambahKaryawan";

export default function ManageEmployee() {
  const goBack = () => {
    window.history.back() ?? Navigate("/");
  };
  return (
    <>
      <div className="row mt-5">
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
          <h1>Kelola Karyawan</h1>
          <p>Tambah, Update, Hapus dan Detail karyawan</p>
        </div>
        <div className="col text-end">
          <ModalTambahKaryawan />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Karyawan />
        </div>
      </div>
    </>
  );
}
