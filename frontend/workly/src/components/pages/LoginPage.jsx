import LoginAdminForm from "../forms/LoginAdminForm";
import LoginEmployeeForm from "../forms/LoginEmployeeForm";
import "../../css/main.css";

export default function LoginPage() {
  return (
    <div className="position-relative w-100">
      <div
        className="card-login bg-light-subtle position-absolute top-50 start-50 translate-middle p-5 rounded-4"
        style={{
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1 style={{ fontSize: 60 }} className="d-inline mb-5 fw-bolder">
          Workly<span className="text-secondary">.</span>
        </h1>
        <ul className="nav nav-tabs mb-3 mt-5" id="myTab" role="tablist">
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
              Login as Employee
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
              Login as Admin
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
            <LoginEmployeeForm />
          </div>
          <div
            className="tab-pane fade"
            id="admin-tab-pane"
            role="tabpanel"
            aria-labelledby="admin-tab"
            tabIndex="0"
          >
            <LoginAdminForm />
          </div>
        </div>
      </div>
    </div>
  );
}
