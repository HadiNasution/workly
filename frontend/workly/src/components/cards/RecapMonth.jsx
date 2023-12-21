import {
  BsHouseFill,
  BsGeoAltFill,
  BsClockFill,
  BsArrowRightSquareFill,
  BsArrowLeftSquareFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import axios from "axios";
import { useState, useEffect } from "react";
import { convertDayString } from "../../utils/date-time";

export default function RecapDay() {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const getRecap = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const { data } = await axios.get(
        `http://localhost:3000/api/employee/attendance/month`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          params: {
            month,
            year,
          },
        }
      );

      console.log(data.data);
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  return (
    <div className="row">
      <div className="col">
        <div className="d-block">
          <form onSubmit={(event) => getRecap(event)} className="d-flex mb-4">
            <select
              className="form-select m-1"
              aria-label="Default select example"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="0">Januari</option>
              <option value="1">Februari</option>
              <option value="2">Maret</option>
              <option value="3">April</option>
              <option value="4">Mei</option>
              <option value="5">Juni</option>
              <option value="6">Juli</option>
              <option value="7">Agustus</option>
              <option value="8">September</option>
              <option value="9">Oktober</option>
              <option value="10">November</option>
              <option value="11">Desember</option>
            </select>
            <select
              className="form-select m-1"
              aria-label="Default select example"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="1">2019</option>
              <option value="2">2020</option>
              <option value="3">2021</option>
              <option value="3">2022</option>
              <option value="3">2023</option>
            </select>
            <button type="submit" className="btn btn-secondary m-1">
              Tampilkan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
