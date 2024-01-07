import axios from "axios";
import { useState, useEffect } from "react";
import { toastWarning } from "../alert/SweetAlert";
import { fullTimeFormat } from "../../utils/date-time";
import {
  BsCalendar2Fill,
  BsInfoCircleFill,
  BsExclamationTriangleFill,
} from "react-icons/bs";

export default function Log() {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth + 1);
  const [result, setResult] = useState([]);

  const getLog = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:3000/api/admin/log`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          month,
          year,
        },
      });
      // console.log(data.data);
      setResult(data.data);
    } catch (error) {
      console.error("Server Response:", error.response.data);
      toastWarning("Data kosong");
    }
  };

  const showCard = () => {
    if (result) {
      return result.map((item, index) => (
        <div key={index} className="d-flex">
          <div className="card m-1 w-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div className="date">
                  <BsCalendar2Fill className="me-2" />
                  {fullTimeFormat(item.date)}
                </div>
                <div className="info">
                  {item.is_error ? (
                    <>
                      <BsExclamationTriangleFill className="me-2 text-danger" />
                      {item.note}
                    </>
                  ) : (
                    <>
                      <BsInfoCircleFill className="me-2 text-info" />
                      {item.note}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    } else {
      return "";
    }
  };

  useEffect(() => {
    // console.log(result);
  }, [result]);

  return (
    <div className="row">
      <div className="col">
        <div className="d-block">
          <form
            onSubmit={(event) => getLog(event)}
            className="d-flex mb-4"
            method="get"
          >
            <select
              className="form-select m-1"
              aria-label="Default select example"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            <select
              className="form-select m-1"
              aria-label="Default select example"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <button type="submit" className="btn btn-primary m-1">
              Tampilkan
            </button>
          </form>
        </div>
        {showCard()}
      </div>
    </div>
  );
}
