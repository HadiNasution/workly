import axios from "axios";

export default function ResetPasswordEmployee() {
  const goBack = () => {
    window.history.back();
  };
  async function ResetPasswordEmployee(event) {
    event.preventDefault();

    try {
      const name = document.getElementById("employee-name").value;
      const nip = document.getElementById("employee-nip").value;
      const email = document.getElementById("employee-email").value;

      const { data } = await axios.get(
        "http://localhost:3000/api/employee/resetpassword",
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
        <h2 style={{ fontWeight: "bolder" }}>Reset Password - Employee</h2>
        <p>Masukan Nama lengkap, NIP, dan Email untuk Reset password.</p>
        <form onSubmit={ResetPasswordEmployee} method="get">
          <div className="mb-3">
            <label htmlFor="employee-name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="employee-name"
              name="employee-name"
              placeholder="Ichbal Hadi Nasution"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="employee-nip" className="form-label">
              NIP
            </label>
            <input
              type="email"
              className="form-control"
              id="employee-nip"
              name="employee-nip"
              placeholder="183040066"
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="employee-email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="employee-email"
              name="employee-email"
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
