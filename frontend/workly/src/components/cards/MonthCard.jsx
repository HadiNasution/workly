import {
  BsHouseFill,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { convertDayString } from "../../utils/date-time";

export default function MonthCard(data) {
  const item = data.data;

  const timeFormat = (date) => {
    let dateString = date;
    let dateObject = new Date(dateString);

    let jam = dateObject.getHours();
    let menit = dateObject.getMinutes();

    let formatWaktu = `${jam}:${menit}`;
    return formatWaktu;
  };

  const dateFormat = (date) => {
    let dateString = date;
    let dateObject = new Date(dateString);

    let hari = convertDayString(dateObject);
    let tanggal = dateObject.getDate();

    let formatWaktu = `${hari} ${tanggal}`;
    return formatWaktu;
  };

  return (
    <>
      <div className="card m-1 w-100">
        <div className="card-header">
          <h4>{dateFormat(item.time_in)}</h4>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-start">
            <p className="me-4">
              <BsArrowRightSquareFill
                className="me-2"
                style={{ color: "cyan" }}
              />{" "}
              Absen masuk <br></br>
              {item.time_in ? timeFormat(item.time_in) : <i>-</i>}
            </p>
            <p className="me-4">
              <BsArrowLeftSquareFill
                className="me-2"
                style={{ color: "yellow" }}
              />{" "}
              Absen keluar <br></br>
              {item.time_out ? timeFormat(item.time_out) : <i>-</i>}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="me-4">
              <BsHouseFill className="me-2" /> Lokasi kerja <br></br>
              {item.is_wfh ? "Work From Home" : "Di kantor"}
            </p>
            <p>
              <BsExclamationCircleFill className="me-2" /> Waktu absen <br></br>
              {item.is_late ? (
                <span style={{ color: "red" }}>Terlambat</span>
              ) : (
                <span style={{ color: "green" }}>Tepat waktu</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
