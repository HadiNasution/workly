import axios from "axios";
import { useState, useEffect } from "react";
import { BsPersonFill, BsClockFill, BsGeoAltFill } from "react-icons/bs";

export default function RecapDayAdmin() {
  const [dataRecap, setDataRecap] = useState(null);

  const getRecap = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/recap/day`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(data.data);
      if (data.data) setDataRecap(data.data);
    } catch (error) {
      // if (error.response) {
      //   console.error("Server Response:", error.response.data);
      // }
    }
  };

  const timeFormat = (date) => {
    const dateOutString = date;
    const dateOutObject = new Date(dateOutString);

    const jam = dateOutObject.getHours();
    const menit = dateOutObject.getMinutes();
    return `${jam}:${menit}`;
  };

  const showRecap = () => {
    return dataRecap.map((item, index) => (
      <div className="card mt-2" key={index}>
        <div
          className="card-header"
          style={{ paddingBottom: 0, paddingTop: 14 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <div>
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
              </div>
              <div className="d-inline align-items-center">
                <p>
                  <b>{item.name}</b> <br></br>
                  <BsGeoAltFill className="me-1 mb-1" />
                  {item.wfh ? "WFH" : "Dikantor"}
                  <BsClockFill className="me-1 ms-3 mb-1" />
                  in {timeFormat(item.time_in)} • out{" "}
                  {item.time_out ? timeFormat(item.time_out) : "..."}
                  <BsPersonFill className="me-1 ms-3 mb-1" /> {item.role} •{" "}
                  {item.departmen}
                </p>
              </div>
            </div>
            <p>
              {item.is_late ? (
                <span style={{ color: "#ff4d52" }}>Terlambat</span>
              ) : (
                <span className="text-success">Terlambat</span>
              )}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    // reload data recap setiap 1 detik
    // const reloadRecap = () => {
    //   getRecap();
    // };
    // reloadRecap();
    // const intervalId = setInterval(reloadRecap, 1000);
    // return () => clearInterval(intervalId);
    getRecap();
  }, []);

  return dataRecap && dataRecap.length > 0 ? (
    showRecap()
  ) : (
    <i>Data masih kosong</i>
  );
}
