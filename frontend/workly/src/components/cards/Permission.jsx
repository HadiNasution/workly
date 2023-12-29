import { BsEyeFill, BsTrashFill, BsPencilFill } from "react-icons/bs";

export default function Permission() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="info">
            <img
              src={
                false
                  ? `http://localhost:3000/${item.picture}`
                  : "/assets/avatar-default.svg"
              }
              height={50}
              width={50}
              alt="foto-karyawan"
              className="rounded-circle me-3"
            ></img>
            <p className="d-inline">
              <b>Nama</b>•email•role
            </p>
          </div>
          <div className="action">
            <BsEyeFill
              className="me-2 ms-2 fs-4"
              color="blue"
              style={{ cursor: "pointer" }}
            />
            <BsPencilFill
              className="me-2 ms-2 fs-4"
              color="green"
              style={{ cursor: "pointer" }}
            />
            <BsTrashFill
              className="me-2 ms-2 fs-4"
              color="red"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
