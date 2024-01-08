import { axiosGet, axiosDelete } from "../../controller/api-controller";
import { useState, useEffect } from "react";
import { dateFormat } from "../../utils/date-time";
import { alertError, toastSuccess } from "../alert/SweetAlert";
import Swal from "sweetalert2";
import ShimmerCard from "../loading/shimmer";
import ModalUpdateKaryawan from "../modals/ModalUpdateKaryawan";

export default function Karyawan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  const getEmployee = () => {
    axiosGet(`http://localhost:3000/api/admin/get/employee`, token)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Get employee failed : ", error);
        setLoading(false);
      });
  };

  const confirmDelete = (nip, name) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda ingin menghapus ${name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(nip);
      }
    });
  };

  const deleteEmployee = (nip) => {
    axiosDelete(`http://localhost:3000/api/admin/delete/employee/${nip}`, token)
      .then((result) => {
        toastSuccess(`Karyawan dengan nip ${nip} berhasil dihapus`, "");
        getEmployee();
      })
      .catch((error) => {
        console.error("Get employee failed : ", error);
        alertError(`Gagal hapus karyawan ${nip}`, error);
      });
  };

  const showEmployee = () => {
    return data.map((item) => (
      <div
        className="accordion"
        id={`accordionEmployee${item.id}`}
        key={item.id}
      >
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#accordion${item.id}`}
              aria-controls={`accordion${item.id}`}
              aria-expanded="false"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="info">
                  <img
                    src={
                      item.picture
                        ? `http://localhost:3000/${item.picture}`
                        : "/assets/avatar-default.svg"
                    }
                    height={50}
                    width={50}
                    style={{ objectFit: "cover" }}
                    alt="foto-karyawan"
                    className="rounded-circle me-3"
                  ></img>
                  <p className="d-inline">
                    <b>{item.name}</b> • {item.email} • {item.nip}
                  </p>
                </div>
              </div>
            </button>
          </h2>
          <div
            id={`accordion${item.id}`}
            className="accordion-collapse collapse"
            data-bs-parent="accordionEmployee"
          >
            <div className="accordion-body">
              <div className="row">
                <div className="col">
                  <p>
                    <b>Departmen:</b> <br></br> {item.departmen}
                  </p>
                  <p>
                    <b>Role:</b> <br></br> {item.role}
                  </p>
                  <p>
                    <b>Tanggal gabung:</b> <br></br> {dateFormat(item.join)}
                  </p>
                  <p>
                    <b>Tanggal jatuh tempo:</b> <br></br>{" "}
                    {dateFormat(item.quit)}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <b>Total sakit :</b> <br></br> {item.sick}
                  </p>
                  <p>
                    <b>Total izin :</b> <br></br> {item.permits}
                  </p>
                  <p>
                    <b>Total terlambat :</b> <br></br> {item.late}
                  </p>
                  <p>
                    <b>Total cuti :</b> <br></br> {item.leaves}
                  </p>
                </div>
                <div className="col">
                  <p>
                    <b>Total WFH :</b> <br></br> {item.wfh}
                  </p>
                  <p>
                    <b>Total hari kerja :</b> <br></br> {item.works}
                  </p>
                </div>
                <div className="col text-end">
                  <ModalUpdateKaryawan
                    userId={item.id}
                    modalId={`update${item.id}`}
                    reload={getEmployee}
                  />
                  <button
                    className="btn btn-danger ms-3"
                    onClick={() => confirmDelete(item.nip, item.name)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <div>
      {loading ? (
        <ShimmerCard />
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
            showEmployee()
          )}
        </div>
      )}
    </div>
  );
}
