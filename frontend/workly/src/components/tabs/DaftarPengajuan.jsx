import CardPermission from "../cards/Permission";

export default function DaftarPengajuan({ data, approve, approved, rejected }) {
  const ApprovedCardList = (data) => {
    return data && data.length > 0 ? (
      approved !== 0 ? (
        data.map(
          (item, index) =>
            item.is_approved && <CardPermission key={index} {...item} />
        )
      ) : (
        <div className="text-center mt-5 mb-5">
          <img
            src="../../../public/assets/empty-ill.gif"
            alt="sleep illustration"
            width={200}
            height={200}
          />
          <h6 className="text-secondary">Belum ada pengajuan...</h6>
        </div>
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/empty-ill.gif"
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
      rejected !== 0 ? (
        data.map(
          (item, index) =>
            item.is_approved === false && (
              <CardPermission key={index} {...item} />
            )
        )
      ) : (
        <div className="text-center mt-5 mb-5">
          <img
            src="../../../public/assets/empty-ill.gif"
            alt="sleep illustration"
            width={200}
            height={200}
          />
          <h6 className="text-secondary">Belum ada pengajuan...</h6>
        </div>
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/empty-ill.gif"
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
      approve !== 0 ? (
        data.map(
          (item, index) =>
            item.is_approved === null && (
              <CardPermission key={index} {...item} />
            )
        )
      ) : (
        <div className="text-center mt-5 mb-5">
          <img
            src="../../../public/assets/empty-ill.gif"
            alt="sleep illustration"
            width={200}
            height={200}
          />
          <h6 className="text-secondary">Belum ada pengajuan...</h6>
        </div>
      )
    ) : (
      <div className="text-center mt-5 mb-5">
        <img
          src="../../../public/assets/empty-ill.gif"
          alt="sleep illustration"
          width={200}
          height={200}
        />
        <h6 className="text-secondary">Belum ada pengajuan...</h6>
      </div>
    );
  };

  return (
    <>
      <ul className="nav nav-tabs mb-2" id="pengajuanTab" role="tablist">
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
            Rejected ({rejected ? rejected : 0})
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
    </>
  );
}
