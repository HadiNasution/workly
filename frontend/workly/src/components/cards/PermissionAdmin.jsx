import { convertDayString } from "../../utils/date-time";
import { BsArrowRight, BsImageFill } from "react-icons/bs";

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

export function CardPermissionAdminApproval({
  name,
  type,
  start_date,
  end_date,
  images,
  note,
}) {
  return (
    <div className="card mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5>
            {name} • {type}
          </h5>
          <div className="action">
            <button className="btn btn-danger me-2">Reject</button>
            <button className="btn btn-secondary">Approve</button>
          </div>
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

export function CardPermissionAdmin({
  name,
  type,
  start_date,
  end_date,
  images,
  note,
}) {
  return (
    <div className="card mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5>
            {name} • {type}
          </h5>
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
