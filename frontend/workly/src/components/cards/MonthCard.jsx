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

    let formatWaktu = `${jam}:${menit < 10 ? "0" : ""}${menit}`;
    return formatWaktu;
  };

  const dateFormat = (date) => {
    let dateString = date;
    let dateObject = new Date(dateString);

    let hari = convertDayString(dateObject);
    let tanggal = dateObject.getDate();

    let formatWaktu = `${hari}, ${tanggal}`;
    return formatWaktu;
  };

  return (
    <>
      <div className="card w-100" style={{ minWidth: 250, minHeight: 120 }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>{dateFormat(item.time_in)}</h4>
          <span class="badge text-bg-danger">
            {item.is_late ? "Terlambat" : ""}
          </span>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-around align-items-center">
            <p className="me-3">
              <BsArrowRightSquareFill className="me-1 mb-1" color="blue" />
              {item.time_in ? timeFormat(item.time_in) : <i>-</i>}
            </p>
            <p className="me-3">
              <BsArrowLeftSquareFill className="me-1 mb-1" color="orange" />
              {item.time_out ? timeFormat(item.time_out) : <i>-</i>}
            </p>
            {item.is_wfh ? (
              <p>
                <BsHouseFill className="me-1 mb-1" color="lime" />
                WFH
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
