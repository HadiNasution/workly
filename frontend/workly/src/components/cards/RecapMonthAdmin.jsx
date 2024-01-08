import { axiosGetBlobContent } from "../../controller/api-controller";
import axios from "axios";
import { useState, useEffect } from "react";
import MonthCardAdmin from "./MonthCardAdmin";
import { saveAs } from "file-saver";
import { convertMonthString } from "../../utils/date-time";
import { toastWarning } from "../alert/SweetAlert";

export default function RecapMonthAdmin() {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth + 1);
  const [result, setResult] = useState([]);
  const [showDownload, setShowDownload] = useState(false);
  const token = sessionStorage.getItem("token");

  const getRecap = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/recap/month`,
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
      setResult(data.data);
      setShowDownload(true);
    } catch (error) {
      setShowDownload(false);
      if (error.response) {
        console.error("Server Response:", error.response.data.errors);
        toastWarning(error.response.data.errors);
      }
    }
  };

  const showCard = () => {
    if (result.length !== 0) {
      return result.map((item, index) => (
        <div key={index} className="col">
          <MonthCardAdmin data={item} />
        </div>
      ));
    } else {
      return "";
    }
  };

  const downloadRecap = () => {
    axiosGetBlobContent(`http://localhost:3000/api/admin/download/recap`, token)
      .then((result) => {
        saveAs(
          result,
          `attendance_recap/${convertMonthString(month)}/${year}.csv`
        );
      })
      .catch((error) => {
        console.error("Download recap failed ", error);
      });
  };

  useEffect(() => {}, [result]);

  return (
    <div className="row">
      <div className="col">
        <div className="d-block">
          <form
            onSubmit={(event) => getRecap(event)}
            className="d-flex mb-4"
            method="get"
          >
            <select
              className="form-select m-1"
              aria-label="Default select example"
              id="month-recap"
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
              id="year-recap"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <button type="submit" className="btn btn-primary m-1">
              Tampilkan
            </button>
            <button
              className="btn btn-secondary m-1"
              hidden={!showDownload}
              onClick={downloadRecap}
            >
              Download
            </button>
          </form>
        </div>
        <div className="row">{showCard()}</div>
      </div>
    </div>
  );
}
