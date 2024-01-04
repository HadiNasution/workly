import { BsPersonFill } from "react-icons/bs";
import axios from "axios";
import { alertError, toastSuccess, toastWarning } from "../alert/SweetAlert";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import ModalUpdateAdmin from "../modals/ModalUpdateAdmin";

export default function Admin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      if (data.data) {
        setData(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Server Response:", error);
      toastWarning("Data kosong");
    }
  };

  const confirmDelete = (nip, name) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda ingin menghapus admin ${name}`,
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
        getAdmin();
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
                reload={getAdmin}
              />
              <button
                className="btn btn-danger"
                onClick={() => {
                  confirmDelete(item.nip, item.name);
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

  return (
    <div>
      {loading ? (
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        <div>
          {data.length === 0 ? (
            <div className="text-center mt-5 mb-5">
              <img
                src="../../../public/assets/sleep-ill.gif"
                alt="sleep illustration"
                width={200}
                height={200}
              />
              <h6 className="text-secondary">Belum ada yang absen masuk...</h6>
            </div>
          ) : (
            showAdmin()
          )}
        </div>
      )}
    </div>
  );
}
