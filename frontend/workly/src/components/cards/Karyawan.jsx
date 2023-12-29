import axios from "axios";
import { useState, useEffect } from "react";
import { BsTrashFill, BsPencilFill } from "react-icons/bs";
import { convertDayString } from "../../utils/date-time";
import { alertError, toastSuccess } from "../alert/SweetAlert";

export default function Karyawan() {
  const [data, setData] = useState(null);

  const getEmployee = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/get/employee`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(data.data);
      if (data.data) setData(data.data);
    } catch (error) {
      console.error("Server Response:", error.response.data);
      toastWarning("Data kosong");
    }
  };

  const deleteEmployee = async (nip) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.delete(
        `http://localhost:3000/api/admin/delete/employee/${nip}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(data.data);
      if (data.data) toastSuccess("Berhasil", data.data);
    } catch (error) {
      console.error("Server Response:", error.response.data);
      alertError(`Gagal hapus karyawan ${nip}`, error);
    }
  };

  const formatTime = (date) => {
    const dateString = date;
    const dateObject = new Date(dateString);

    const hari = convertDayString(dateObject);
    const tanggal = dateObject.getDate();
    const bulan = dateObject.getMonth() + 1;
    const tahun = dateObject.getFullYear();
    return `${hari} ${tanggal}/${bulan}/${tahun}`;
  };

  const showEmployee = () => {
    return data.map((item) => (
      <div className="accordion mt-2 mb-2" id="accordionEmployee" key={item.id}>
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
                    <b>Tanggal gabung:</b> <br></br> {formatTime(item.join)}
                  </p>
                  <p>
                    <b>Tanggal jatuh tempo:</b> <br></br>{" "}
                    {formatTime(item.quit)}
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
                  <BsPencilFill
                    className="fs-5 me-3"
                    color="blue"
                    style={{ cursor: "pointer" }}
                  />
                  <BsTrashFill
                    className="fs-5 me-3"
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteEmployee(item.nip)}
                  />
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

  return data && data.length > 0 ? (
    showEmployee()
  ) : (
    <div className="text-center mt-5 mb-5">
      <img
        src="../../../public/assets/sleep-ill.gif"
        alt="sleep illustration"
        width={200}
        height={200}
      />
      <h6 className="text-secondary">Data karyawan masih kosong...</h6>
    </div>
  );
}
