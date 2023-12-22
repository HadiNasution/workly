import { BsClockFill, BsCalendar2CheckFill, BsEyeFill } from "react-icons/bs";

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
            style={{ fontWeight: "bold" }}
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
            style={{ fontWeight: "bold" }}
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
            style={{ fontWeight: "bold" }}
          >
            <BsEyeFill className="me-1" />
            Log aplikasi
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="recapday-tab-pane"
          role="tabpanel"
          aria-labelledby="recapday-tab"
          tabIndex="0"
        >
          Recap Day
        </div>
        <div
          className="tab-pane fade"
          id="recapmonth-tab-pane"
          role="tabpanel"
          aria-labelledby="recapmonth-tab"
          tabIndex="0"
        >
          Recap Month
        </div>
        <div
          className="tab-pane fade"
          id="log-tab-pane"
          role="tabpanel"
          aria-labelledby="log-tab"
          tabIndex="0"
        >
          Log
        </div>
      </div>
    </>
  );
}
