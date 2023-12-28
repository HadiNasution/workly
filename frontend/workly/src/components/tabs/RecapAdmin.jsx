import { BsClockFill, BsCalendar2CheckFill, BsEyeFill } from "react-icons/bs";
import RecapDayAdmin from "../cards/RecapDayAdmin";
import RecapMonthAdmin from "../cards/RecapMonthAdmin";
import Log from "../cards/Log";

export default function RecapAdminTab() {
  return (
    <>
      <ul className="nav nav-tabs mb-3 mt-3" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="recapday-tab"
            data-bs-toggle="tab"
            data-bs-target="#recapday-tab-pane"
            type="button"
            role="tab"
            aria-controls="recapday-tab-pane"
            aria-selected="true"
          >
            <BsClockFill className="me-1 mb-1" />
            Kehadiran karyawan hari ini
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="recapmonth-tab"
            data-bs-toggle="tab"
            data-bs-target="#recapmonth-tab-pane"
            type="button"
            role="tab"
            aria-controls="recapmonth-tab-pane"
            aria-selected="false"
          >
            <BsCalendar2CheckFill className="me-1 mb-1" />
            Kehadiran karyawan perbulan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="log-tab"
            data-bs-toggle="tab"
            data-bs-target="#log-tab-pane"
            type="button"
            role="tab"
            aria-controls="log-tab-pane"
            aria-selected="false"
          >
            <BsEyeFill className="me-1" />
            Log aplikasi
          </button>
        </li>
      </ul>
      <div className="tab-content mb-5" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="recapday-tab-pane"
          role="tabpanel"
          aria-labelledby="recapday-tab"
          tabIndex="0"
        >
          <RecapDayAdmin />
        </div>
        <div
          className="tab-pane fade"
          id="recapmonth-tab-pane"
          role="tabpanel"
          aria-labelledby="recapmonth-tab"
          tabIndex="0"
        >
          <RecapMonthAdmin />
        </div>
        <div
          className="tab-pane fade"
          id="log-tab-pane"
          role="tabpanel"
          aria-labelledby="log-tab"
          tabIndex="0"
        >
          <Log />
        </div>
      </div>
    </>
  );
}
