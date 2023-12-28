import axios from "axios";
import { useEffect, useState } from "react";
import { toastWarning } from "../alert/SweetAlert";
import { convertDayString } from "../../utils/date-time";
import {
  BsImageFill,
  BsClockFill,
  BsCheckCircleFill,
  BsArrowRight,
  BsXOctagonFill,
} from "react-icons/bs";

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
        // console.log(data.data);
        setRecap(data.data);
      }
    } catch (error) {
      console.error("Server Response:", error.response.data.errors);
      toastWarning("Data kosong");
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

  // Fungsi untuk menghitung selisih hari antara dua tanggal
  const hitungSelisihHari = (tanggalAwal, tanggalAkhir) => {
    const satuHari = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik

    // Mengkonversi kedua tanggal ke objek Date
    const dateAwal = new Date(tanggalAwal);
    const dateAkhir = new Date(tanggalAkhir);

    // Menghitung selisih dalam milidetik
    const selisihMilidetik = Math.abs(dateAkhir - dateAwal);

    // Menghitung selisih hari
    const selisihHari = Math.floor(selisihMilidetik / satuHari);

    return selisihHari;
  };

  const showRecap = () => {
    if (recap !== null && recap.length !== 0) {
      return recap.map((item) => (
        <div key={item.id}>
          <div className="card w-100 m-2">
            <div className="card-header">
              <div className="d-flex justify-content-between">
                <h5>{item.type}</h5>
                {item.is_approved !== null ? (
                  <h6>
                    {item.is_approved === true ? (
                      <>
                        <BsCheckCircleFill color="lime" className="me-1 mb-1" />
                        <span style={{ color: "lime" }}>Disetujui</span>
                      </>
                    ) : (
                      <>
                        <BsXOctagonFill color="#ff364a" className="me-1 mb-1" />
                        <span style={{ color: "#ff364a" }}>Ditolak</span>
                      </>
                    )}
                  </h6>
                ) : (
                  <div className="d-flex justify-content-start align-items-center">
                    <BsClockFill color="yellow" className="mb-1 me-1" />
                    <span style={{ color: "yellow" }}>
                      Menunggu untuk disetujui
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <p>
                  {dateFormated(item.start_date)}
                  <BsArrowRight className="me-2 ms-2" />
                  {dateFormated(item.end_date)}
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
                <b>{hitungSelisihHari(item.start_date, item.end_date)} Hari</b>
              </p>
              <p>
                <b>Catatan :</b> {item.note}
              </p>
            </div>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="text-center">
          <img
            src="../../../public/assets/horse-glass.gif"
            alt="sleep illustration"
            width={200}
            height={200}
          />
          <h6 className="text-secondary">Anda belum mengajukan apapun...</h6>
        </div>
      );
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
