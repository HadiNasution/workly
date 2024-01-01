import { useState, useEffect } from "react";
import axios from "axios";
import CardPermissionAdmin from "../cards/PermissionAdmin";

export default function ModalKelolaPengajuan() {
  const [data, setData] = useState(null);
  const [approved, setApproved] = useState(0);
  const [approve, setApprove] = useState(0);
  const [reject, setRejected] = useState(0);

  const getPengajuan = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/permission",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data) {
        setData(data.data.result);
        setApprove(data.data.status.approve);
        setApproved(data.data.status.approved);
        setRejected(data.data.status.rejected);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ApprovedCardList = (data) => {
    return data && data.length > 0 ? (
      data.map(
        (item, index) =>
          item.is_approved && <CardPermissionAdmin key={index} {...item} />
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/sleep-ill.gif"
          alt="sleep illustration"
          width={200}
          height={200}
        />
        <h6 className="text-secondary">Belum ada pengajuan...</h6>
      </div>
    );
  };

  const RejectedCardList = (data) => {
    return data && data.length > 0 ? (
      data.map(
        (item, index) =>
          item.is_approved === false && (
            <CardPermissionAdmin key={index} {...item} />
          )
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/sleep-ill.gif"
          alt="sleep illustration"
          width={200}
          height={200}
        />
        <h6 className="text-secondary">Belum ada pengajuan...</h6>
      </div>
    );
  };

  const NeedApprovalCardList = (data) => {
    return data && data.length > 0 ? (
      data.map(
        (item, index) =>
          item.is_approved === null && (
            <CardPermissionAdmin key={index} {...item} />
          )
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/sleep-ill.gif"
          alt="sleep illustration"
          width={200}
          height={200}
        />
        <h6 className="text-secondary">Belum ada pengajuan...</h6>
      </div>
    );
  };

  useEffect(() => {
    getPengajuan();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/bell.png"
            alt="pengajuan-icon"
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#kelolaPengajuanModal"
            >
              Kelola Pengajuan
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="kelolaPengajuanModal"
        tabIndex="-1"
        aria-labelledby="kelolaPengajuanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="kelolaPengajuanModalLabel">
                Kelola Pengajuan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul
                className="nav nav-tabs mb-2"
                id="pengajuanTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="belum-approve-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#belum-approve-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="belum-approve-tab-pane"
                    aria-selected="true"
                  >
                    Belum di approve ({approve ? approve : 0})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="approved-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#approved-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="approved-tab-pane"
                    aria-selected="false"
                  >
                    Approved ({approved ? approved : 0})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="rejected-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#rejected-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="rejected-tab-pane"
                    aria-selected="false"
                  >
                    Rejected ({reject ? reject : 0})
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="belum-approve-tab-pane"
                  role="tabpanel"
                  aria-labelledby="belum-approve-tab"
                  tabIndex="0"
                >
                  {NeedApprovalCardList(data)}
                </div>
                <div
                  className="tab-pane fade"
                  id="approved-tab-pane"
                  role="tabpanel"
                  aria-labelledby="approved-tab"
                  tabIndex="0"
                >
                  {ApprovedCardList(data)}
                </div>
                <div
                  className="tab-pane fade"
                  id="rejected-tab-pane"
                  role="tabpanel"
                  aria-labelledby="rejected-tab"
                  tabIndex="0"
                >
                  {RejectedCardList(data)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
