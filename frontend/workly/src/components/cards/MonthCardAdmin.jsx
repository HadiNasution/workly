import { BsPersonFill } from "react-icons/bs";

export default function MonthCardAdmin(data) {
  const item = data.data;
  return (
    <div className="card m-2 w-100">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5>
            <img
              src={
                item.picture
                  ? `http://localhost:3000/${item.picture}`
                  : "/assets/avatar-default.svg"
              }
              height={50}
              width={50}
              className="rounded-circle me-3"
            ></img>
            {item.name}
          </h5>
          <p>
            {item.nip} • {item.email}
          </p>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-start align-items-center">
          <p className="me-4">
            <b>{item.count_late}</b>x Terlambat
          </p>
          <p className="me-4">
            <b>{item.count_sick}</b>x Sakit
          </p>
          <p className="me-4">
            <b>{item.count_leaves}</b>x Cuti dipakai
          </p>
          <p className="me-4">
            <b>{item.count_wfh}</b>x WFH
          </p>
          <p>
            <b>{item.count_permits}</b>x Izin
          </p>
        </div>
        <p className="text-success">
          <b>Total kehadiran : {item.count_works}</b>
        </p>
      </div>
    </div>
  );
}
