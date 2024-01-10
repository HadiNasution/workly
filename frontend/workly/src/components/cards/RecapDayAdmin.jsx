import { axiosGet } from "../../controller/api-controller";
import { useState, useEffect } from "react";
import { BsPersonFill, BsClockFill, BsGeoAltFill } from "react-icons/bs";
import ShimmerCard from "../loading/shimmer";
import { timeFormat } from "../../utils/date-time";

export default function RecapDayAdmin() {
  const [dataRecap, setDataRecap] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("admin-token");

  const getRecap = async () => {
    axiosGet(`http://localhost:3000/api/admin/recap/day`, token)
      .then((result) => {
        setDataRecap(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Get recap failed : ", error);
        setLoading(false);
      });
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
              ) : null}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    //reload data recap setiap 1 detik
    const reloadRecap = () => {
      getRecap();
    };
    reloadRecap();
    const intervalId = setInterval(reloadRecap, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </>
      ) : (
        <div>
          {dataRecap.length === 0 ? (
            <div className="text-center mt-5 mb-5">
              <img
                src="../../../public/assets/sleep-ill.gif"
                alt="sleep illustration"
                width={200}
                height={200}
              />
              <h6 className="text-secondary">Belum ada yang absen masuk...</h6>
            </div>
          ) : (
            showRecap()
          )}
        </div>
      )}
    </div>
  );
}
