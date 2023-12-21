import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { convertDayString } from "../../utils/date-time";
import { BsImageFill, BsClockFill } from "react-icons/bs";

export default function ModalDaftarPengajuan() {
  const [recap, setRecap] = useState(null);

  const getDaftarPengajuan = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/employee/permission",
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data) {
        console.log(data.data);
        setRecap(data.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      Swal.fire({
        title: "Data kosong",
        icon: "warning",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  const dateFormated = (date) => {
    let dateString = date;
    let dateObject = new Date(dateString);

    let hari = convertDayString(dateObject);
    let tanggal = dateObject.getDate();
    let bulan = dateObject.getMonth() + 1;
    let tahun = dateObject.getFullYear();

    let formatWaktu = `${hari} ${tanggal}/${bulan}/${tahun}`;
    return formatWaktu;
  };

  const typeFormated = (type) => {
    let formatedType;
    switch (type) {
      case "sakit":
        formatedType = "Sakit";
        break;
      case "leaves":
        formatedType = "Izin";
        break;
      case "cuti":
        formatedType = "Cuti";
        break;
      case "wfh":
        formatedType = "WFH";
        break;

      default:
        formatedType = "";
        break;
    }
    return formatedType;
  };

  const showRecap = () => {
    console.log(recap);
    if (recap) {
      return recap.map((item) => (
        <div key={item.id}>
          <div className="card w-100 m-2">
            <div className="card-header">
              <div className="d-flex justify-content-between">
                <h5>{typeFormated(item.type)}</h5>
                {item.is_approved ? (
                  <h5 style={{ color: "lime" }}>Disetujui</h5>
                ) : (
                  <div className="d-flex justify-content-start align-items-center">
                    <BsClockFill
                      style={{ color: "yellow" }}
                      className="mb-2 me-2"
                    />
                    <h5 style={{ color: "yellow" }}>Belum disetujui</h5>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <p>
                  <b>Tanggal mulai :</b> {dateFormated(item.start_date)}
                </p>
                {item.images ? (
                  <div className="surat">
                    <BsImageFill />{" "}
                    <a
                      href={`http://localhost:3000/${item.images}`}
                      target="_blank"
                    >
                      Lihat surat
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <p>
                <b>Tanggal selesai :</b> {dateFormated(item.end_date)}
              </p>
              <p>
                <b>Catatan :</b> {item.note}
              </p>
            </div>
          </div>
        </div>
      ));
    } else {
      return <i>Anda belum mengajukan apapun...</i>;
    }
  };

  useEffect(() => {
    getDaftarPengajuan();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/bell.png"
            alt="holiday"
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#daftarPengajuanModal"
            >
              Status Pengajuan
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="daftarPengajuanModal"
        tabIndex="-1"
        aria-labelledby="daftarPengajuanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="daftarPenfajuanModalLabel">
                Daftar pengajuan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{showRecap(recap)}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
