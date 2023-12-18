import React from "react";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { useState } from "react";

export default function Modal({ data }) {
  const navigate = useNavigate();
  const [isCopied, setCopied] = useState(false);

  // jika data tersedia, modal akan muncul jika tidak modal tidak akan muncul
  return data ? (
    <div
      id="modal-reset-password"
      className="modal bg-body-secondary"
      style={{ display: "block" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Reset Password Berhasil</h3>
          </div>
          <div className="modal-body">
            <p>Gunakan password sementara ini untuk login : </p>
            <h2 className="d-flex justify-content-between p-3 bg-success text-white rounded text-warning fw-bolder">
              {data && <p>{data}</p>}
              <CopyToClipboard text={data} onCopy={() => setCopied(true)}>
                <span
                  style={{ cursor: "pointer" }}
                  title={isCopied ? "Copied!" : "Copy to Clipboard"}
                >
                  {isCopied ? <BsClipboardCheck /> : <BsClipboard />}
                </span>
              </CopyToClipboard>
            </h2>
            <p>Segera ganti password anda setelah berhasil login.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => navigate("/")}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
