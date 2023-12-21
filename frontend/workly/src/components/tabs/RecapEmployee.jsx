import RecapDay from "../cards/RecapDay";
import RecapMonth from "../cards/RecapMonth";

export default function RecapEmployeeTab() {
  return (
    <>
      <ul className="nav nav-tabs mb-3 mt-3" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="employee-tab"
            data-bs-toggle="tab"
            data-bs-target="#employee-tab-pane"
            type="button"
            role="tab"
            aria-controls="employee-tab-pane"
            aria-selected="true"
            style={{ fontWeight: "bold" }}
          >
            Kehadiran hari ini
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="admin-tab"
            data-bs-toggle="tab"
            data-bs-target="#admin-tab-pane"
            type="button"
            role="tab"
            aria-controls="admin-tab-pane"
            aria-selected="false"
            style={{ fontWeight: "bold" }}
          >
            Kehadiran perbulan
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="employee-tab-pane"
          role="tabpanel"
          aria-labelledby="employee-tab"
          tabIndex="0"
        >
          <RecapDay />
        </div>
        <div
          className="tab-pane fade"
          id="admin-tab-pane"
          role="tabpanel"
          aria-labelledby="admin-tab"
          tabIndex="0"
        >
          <RecapMonth />
        </div>
      </div>
    </>
  );
}
