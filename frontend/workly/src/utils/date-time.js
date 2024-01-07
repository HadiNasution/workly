export const currentTime = new Date();
export const date = currentTime.getDate();
export const hours = currentTime.getHours();
export const minutes = currentTime.getMinutes();
export const year = currentTime.getFullYear();

export const dayString = () => {
  const day = currentTime.getDay();
  let dayFormated;
  switch (day) {
    case 1:
      dayFormated = "Senin";
      break;
    case 2:
      dayFormated = "Selasa";
      break;
    case 3:
      dayFormated = "Rabu";
      break;
    case 4:
      dayFormated = "Kamis";
      break;
    case 5:
      dayFormated = "Jumat";
      break;
    case 6:
      dayFormated = "Sabtu";
      break;
    case 7:
      dayFormated = "Minggu";
      break;

    default:
      dayFormated = "";
      break;
  }
  return dayFormated;
};

export const monthString = () => {
  const month = currentTime.getMonth();
  let monthFormated;
  switch (month) {
    case 0:
      monthFormated = "Januari";
      break;
    case 1:
      monthFormated = "Februari";
      break;
    case 2:
      monthFormated = "Maret";
      break;
    case 3:
      monthFormated = "April";
      break;
    case 4:
      monthFormated = "Mei";
      break;
    case 5:
      monthFormated = "Juni";
      break;
    case 6:
      monthFormated = "Juli";
      break;
    case 7:
      monthFormated = "Agustus";
      break;
    case 8:
      monthFormated = "September";
      break;
    case 9:
      monthFormated = "Oktober";
      break;
    case 10:
      monthFormated = "November";
      break;
    case 11:
      monthFormated = "Desember";
      break;

    default:
      monthFormated = "";
      break;
  }
  return monthFormated;
};

export const convertMonthString = (time) => {
  let monthFormated;
  switch (time) {
    case 0:
      monthFormated = "Januari";
      break;
    case 1:
      monthFormated = "Februari";
      break;
    case 2:
      monthFormated = "Maret";
      break;
    case 3:
      monthFormated = "April";
      break;
    case 4:
      monthFormated = "Mei";
      break;
    case 5:
      monthFormated = "Juni";
      break;
    case 6:
      monthFormated = "Juli";
      break;
    case 7:
      monthFormated = "Agustus";
      break;
    case 8:
      monthFormated = "September";
      break;
    case 9:
      monthFormated = "Oktober";
      break;
    case 10:
      monthFormated = "November";
      break;
    case 11:
      monthFormated = "Desember";
      break;

    default:
      monthFormated = "";
      break;
  }
  return monthFormated;
};

export const convertDayString = (time) => {
  const day = time.getDay();
  let dayFormated;
  switch (day) {
    case 1:
      dayFormated = "Senin";
      break;
    case 2:
      dayFormated = "Selasa";
      break;
    case 3:
      dayFormated = "Rabu";
      break;
    case 4:
      dayFormated = "Kamis";
      break;
    case 5:
      dayFormated = "Jumat";
      break;
    case 6:
      dayFormated = "Sabtu";
      break;
    case 7:
      dayFormated = "Minggu";
      break;

    default:
      dayFormated = "";
      break;
  }
  return dayFormated;
};

export const fullTimeFormat = (date) => {
  const dateOutString = date;
  const dateOutObject = new Date(dateOutString);

  const jam = dateOutObject.getHours();
  const menit = dateOutObject.getMinutes();
  const hari = convertDayString(dateOutObject);
  const tanggal = dateOutObject.getDate();
  const bulan = dateOutObject.getMonth() + 1;
  const tahun = dateOutObject.getFullYear();
  return `${jam < 10 ? "0" : ""}${jam}:${
    menit < 10 ? "0" : ""
  }${menit} ${hari} ${tanggal}/${bulan}/${tahun}`;
};

export const dateFormat = (date) => {
  const dateString = date;
  const dateObject = new Date(dateString);

  const hari = convertDayString(dateObject);
  const tanggal = dateObject.getDate();
  const bulan = dateObject.getMonth() + 1;
  const tahun = dateObject.getFullYear();
  return `${hari} ${tanggal}/${bulan}/${tahun}`;
};

export const timeFormat = (date) => {
  const dateOutString = date;
  const dateOutObject = new Date(dateOutString);

  const jam = dateOutObject.getHours();
  const menit = dateOutObject.getMinutes();
  return `${jam}:${menit < 10 ? "0" : ""}${menit}`;
};

export const dayDateFormat = (date) => {
  let dateString = date;
  let dateObject = new Date(dateString);

  let hari = convertDayString(dateObject);
  let tanggal = dateObject.getDate();

  let formatWaktu = `${hari}, ${tanggal}`;
  return formatWaktu;
};
