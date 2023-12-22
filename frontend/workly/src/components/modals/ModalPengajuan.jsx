import axios from "axios";
import Swal from "sweetalert2";

export default function ModalPengajuan() {
  const kirimPengajuan = async (event) => {
    event.preventDefault();

    const type = document.getElementById("tipe-pengajuan").value;
    const note = document.getElementById("catatan").value;
    const start_date = document.getElementById("waktu-mulai").value;
    const end_date = document.getElementById("waktu-selesai").value;
    const surat = document.getElementById("surat");
    const images = surat.files[0];
    const token = sessionStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("surat", images);
      formData.append("type", type);
      formData.append("note", note);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);

      const { data } = await axios.post(
        "http://localhost:3000/api/employee/create/permission",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.data) {
        console.log(data.data);
        Swal.fire({
          title: "Pengajuan Berhasil!",
          text: "Selalu periksa menu Daftar pengajuan untuk melihat status pengajuan",
          icon: "success",
          background: "#555555",
          color: "#FFFFFF",
          position: "center",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      Swal.fire({
        title: "Ops! Pengajuan gagal dikirim",
        text: "Mohon maaf atas kendala yang terjadi, mohon untuk mencoba kembali lain waktu dan silahkan hubungi admin",
        icon: "error",
        background: "#555555",
        color: "#FFFFFF",
        position: "center",
      });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <img
            src="../../../public/assets/holiday.png"
            alt="holiday"
            height={60}
            width={60}
          ></img>
          <p className="d-inline ms-3">
            <a
              className="stretched-link"
              style={{ color: "white", cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#pengajuanModal"
            >
              Pengajuan Cuti, Sakit, Izin, WFH
            </a>
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="pengajuanModal"
        tabIndex="-1"
        aria-labelledby="pengajuanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="pengajuanModalLabel">
                Pengajuan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                encType="multipart/form-data"
                method="post"
                onSubmit={kirimPengajuan}
              >
                <div className="mb-3">
                  <label className="mb-1">Alasan pengajuan</label>
                  <select
                    className="form-select mb-1"
                    aria-label="Default select example"
                    id="tipe-pengajuan"
                    required
                  >
                    <option value="sick">Sakit</option>
                    <option value="leaves">Cuti</option>
                    <option value="permits">Izin</option>
                    <option value="wfh">WFH</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    for="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Catatan
                  </label>
                  <textarea
                    className="form-control"
                    id="catatan"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="mb-1">
                    Upload dokumen (surat sakit, surat izin, dll)
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    name="surat"
                    id="surat"
                  />
                </div>
                <div className="mb-3">
                  <label for="datepicker" className="form-label">
                    Waktu mulai:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="waktu-mulai"
                    name="waktu-mulai"
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label for="datepicker" className="form-label">
                    Waktu selesai:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="waktu-selesai"
                    name="waktu-selesai"
                    required
                  ></input>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Kirim pengajuan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}