import { convertDayString } from "../../utils/date-time";
import {
  BsImageFill,
  BsClockFill,
  BsCheckCircleFill,
  BsArrowRight,
  BsXOctagonFill,
} from "react-icons/bs";

export default function CardPermission({
  type,
  note,
  start_date,
  end_date,
  images,
  is_approved,
}) {
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

  return (
    <div className="card w-100 mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5>{type}</h5>
          {is_approved !== null ? (
            <h6>
              {is_approved === true ? (
                <>
                  <BsCheckCircleFill color="green" className="me-1 mb-1" />
                  <span style={{ color: "green" }}>Disetujui</span>
                </>
              ) : (
                <>
                  <BsXOctagonFill color="red" className="me-1 mb-1" />
                  <span style={{ color: "red" }}>Ditolak</span>
                </>
              )}
            </h6>
          ) : (
            <h6>
              <BsClockFill color="orangered" className="me-1 mb-1" />
              <span style={{ color: "orangered" }}>
                Menunggu untuk disetujui
              </span>
            </h6>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <p>
            {dateFormated(start_date)}
            <BsArrowRight className="me-2 ms-2" />
            {dateFormated(end_date)}
          </p>
          {images ? (
            <div className="surat">
              <BsImageFill />{" "}
              <a href={`http://localhost:3000/${images}`} target="_blank">
                Lihat surat
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
        <p>
          <b>{hitungSelisihHari(start_date, end_date)} Hari</b>
        </p>
        <p>
          <b>Catatan :</b> {note}
        </p>
      </div>
    </div>
  );
}
