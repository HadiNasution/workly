import {
  BsHouseFill,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
} from "react-icons/bs";
import { dayDateFormat, timeFormat } from "../../utils/date-time";

export default function MonthCard(data) {
  const item = data.data;

  return (
    <>
      <div className="card w-100" style={{ minWidth: 250, minHeight: 120 }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>{dayDateFormat(item.time_in)}</h4>
          <span className="badge text-bg-danger">
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
