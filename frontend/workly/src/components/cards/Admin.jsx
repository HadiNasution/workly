import { BsPersonFill } from "react-icons/bs";
import axios from "axios";
import { alertError, toastSuccess, toastWarning } from "../alert/SweetAlert";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ModalUpdateAdmin from "../modals/ModalUpdateAdmin";

export default function Admin() {
  const [data, setData] = useState(null);
  const token = sessionStorage.getItem("token");

  const getAdmin = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/get/admin`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) setData(data.data);
    } catch (error) {
      console.error("Server Response:", error);
      toastWarning("Data kosong");
    }
  };

  const confirmDelete = (nip) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda ingin menghapus admin dengan nip ${nip}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAdmin(nip);
      }
    });
  };

  const deleteAdmin = async (nip) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/api/admin/delete/admin/${nip}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        toastSuccess(`Admin dengan nip ${nip} berhasil dihapus`, "");
        window.location.reload();
      }
    } catch (error) {
      console.error("Server Response:", error);
      alertError(`Admin nip ${nip} gagal dihapus`, error.response.data.errors);
    }
  };

  const showAdmin = () => {
    return data.map((item) => (
      <div className="card" key={item.id}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="info">
              <p className="d-inline">
                <BsPersonFill
                  className="me-2 fs-4"
                  color={item.is_super_admin ? "purple" : "blue"}
                />
                <b>{item.name}</b> • {item.email} • {item.nip} •{" "}
                {item.is_super_admin ? "Super admin" : "Admin"}
              </p>
            </div>
            <div className="col text-end">
              <ModalUpdateAdmin
                adminId={item.id}
                modalId={`update${item.id}`}
              />
              <button
                className="btn btn-danger"
                onClick={() => {
                  confirmDelete(item.nip);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return data && data.length > 0 ? (
    showAdmin()
  ) : (
    <div className="text-center mt-5 mb-5">
      <img
        src="../../../public/assets/sleep-ill.gif"
        alt="sleep illustration"
        width={200}
        height={200}
      />
      <h6 className="text-secondary">Data admin masih kosong...</h6>
    </div>
  );
}
