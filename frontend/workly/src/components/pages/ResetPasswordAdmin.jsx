import axios from "axios";

export default function ResetPasswordAdmin() {
  const goBack = () => {
    window.history.back();
  };
  async function resetPasswordAdmin(event) {
    event.preventDefault();

    try {
      const name = document.getElementById("admin-name").value;
      const nip = document.getElementById("admin-nip").value;
      const email = document.getElementById("admin-email").value;

      const { data } = await axios.get(
        "http://localhost:3000/api/admin/resetpassword",
        {
          name: name,
          nip: nip,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div className="position-relative w-100">
      <div className="position-absolute top-50 start-50 translate-middle">
        <h2 style={{ fontWeight: "bolder" }}>Reset Password - Admin</h2>
        <p>Masukan Nama lengkap, NIP, dan Email untuk Reset password.</p>
        <form onSubmit={resetPasswordAdmin} method="get">
          <div className="mb-3">
            <label htmlFor="admin-name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="admin-name"
              name="admin-name"
              placeholder="Ichbal Hadi Nasution"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="admin-nip" className="form-label">
              NIP
            </label>
            <input
              type="email"
              className="form-control"
              id="admin-nip"
              name="admin-nip"
              placeholder="183040066"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="admin-email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="admin-email"
              name="admin-email"
              placeholder="name@example.com"
            ></input>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Reset Password
            </button>
            <button
              type="submit"
              onClick={() => goBack()}
              className="btn btn-outline-secondary w-100 mt-3"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
