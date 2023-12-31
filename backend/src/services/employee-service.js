import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
  employeeCreatePermissionValidation,
  employeeChangePasswordValidation,
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";
import { generate } from "random-words";
import geolib from "geolib";
import { logger } from "../app/logging.js";

// Service untuk employee login
const login = async (request) => {
  const loginRequest = validate(employeeLoginValidation, request);

  const employee = await prismaClient.employee.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      role: true,
      password: true,
      token: true,
      token_expires_at: true,
    },
  });

  if (!employee) throw new ResponseError(401, "Email tidak ditemukan");

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    employee.password
  );

  if (!isPasswordValid) throw new ResponseError(401, "Password tidak valid");

  const currentUTCTime = new Date();
  const convertCurrent = new Date(currentUTCTime);
  const localCurrentTime = convertCurrent.toLocaleString();

  const convertExpires = new Date(employee.token_expires_at);
  const localExpires = convertExpires.toLocaleString();

  if (!employee.token_expires_at || localCurrentTime > localExpires) {
    const expiredUTCTime = addMinutes(currentUTCTime, 60); // waktu expired token 1 jam

    const newToken = uuid().toString();

    logger.info("LOGIN EMPLOYEE BERHASIL (WITH NEW TOKEN)");
    const date = new Date();
    const note = `Employee ${loginRequest.email} login pada : ${date} dengan token baru`;
    await prismaClient.log.create({
      data: {
        date,
        note,
      },
    });
    return prismaClient.employee.update({
      data: {
        token: newToken,
        token_expires_at: expiredUTCTime,
      },
      where: {
        email: employee.email,
      },
      select: {
        name: true,
        picture: true,
        email: true,
        role: true,
        token: true,
        token_expires_at: true,
      },
    });
  }
  logger.info("EMPLOYE LOGIN BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${loginRequest.email} login pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.employee.findUnique({
    where: {
      email: employee.email,
    },
    select: {
      name: true,
      email: true,
      role: true,
      picture: true,
      token: true,
      token_expires_at: true,
    },
  });
};

// service untuk employee logout
const logout = async (email) => {
  email = validate(employeeGetValidation, email);

  const isEmailExist = await prismaClient.employee.findUnique({
    where: {
      email: email,
    },
  });

  if (!isEmailExist) throw new ResponseError(400, "Email tidak ditemukan");

  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${email} logout pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.employee.update({
    where: {
      email: email,
    },
    data: {
      token: null,
      token_expires_at: null,
    },
  });
};

// service untuk employee reset password
const reset = async (request) => {
  const resetRequest = validate(employeeResetValidation, request);

  const employee = await prismaClient.employee.findUnique({
    where: {
      name: resetRequest.name,
      nip: resetRequest.nip,
      email: resetRequest.email,
    },
  });

  if (!employee) {
    throw new ResponseError(400, "Akun tidak terdaftar");
  }

  const dummyPass = generate({ minLength: 6, maxLength: 10 });

  const updateEmployeePass = await prismaClient.employee.update({
    data: {
      password: await bcrypt.hash(dummyPass.toString(), 10),
    },
    where: {
      email: resetRequest.email,
    },
  });
  logger.info("RESET PASSWORD ADMIN BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${resetRequest.name} reset password pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  if (updateEmployeePass) return dummyPass;
};

// service untuk employee ganti password
const changePassword = async (request, employee) => {
  const changeRequest = validate(employeeChangePasswordValidation, request);
  const newPassword = await bcrypt.hash(changeRequest.password, 10);
  await prismaClient.employee.update({
    data: {
      password: newPassword,
    },
    where: {
      id: employee.id,
    },
  });
  logger.info("GANTI PASSWORD EMPLOYEE BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${employee.name} ganti password pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
};

// service untuk employee melihat detail profile
const detail = async (nip) => {
  const employee = await prismaClient.employee.findMany({
    where: {
      nip, // ambil semua data di tabel employee dan attendance milik nip tersebut
    },
    include: {
      attendance_recap: true, // join ke tabel attendanceRecap
    },
  });

  if (!employee || employee.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (employee &&
      employee.map((item) => {
        return {
          name: item.name,
          nip: item.nip,
          email: item.email,
          role: item.role ?? null,
          departmen: item.departmen ?? null,
          picture: item.picture ?? null,
          join_date: item.join_date,
          quit_date: item.quit_date ?? null,
          count_late: item.attendance_recap[0].count_late,
          count_sick: item.attendance_recap[0].count_sick,
          count_permits: item.attendance_recap[0].count_permits,
          count_leaves: item.attendance_recap[0].count_leaves,
          count_wfh: item.attendance_recap[0].count_wfh,
          count_works: item.attendance_recap[0].count_works,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  logger.info("RESPONSE DETAIL EMPLOYEE BERHASIL");
  return extractedData;
};

// service untuk employee absen masuk
const absenIn = async (latitude, longitude, wfh, employee) => {
  // ambil data settingan geolokasi
  const setting = await prismaClient.setting.findFirst({
    select: {
      office_radius: true,
      office_latitude: true,
      office_longitude: true,
      minute_late_limit: true,
      time_in: true,
    },
    where: {
      id: 1,
    },
  });

  let isWfh;
  wfh === "false" ? (isWfh = false) : (isWfh = true);

  const currentUTCTime = new Date(); // set waktu sekarang dalam UTC
  const convertCurrent = new Date(currentUTCTime); // convert UTC ke lokal
  const localTime = convertCurrent.toLocaleString(); // waktu sekarang dalam lokal

  const timeLimitUTC = new Date();
  timeLimitUTC.setHours(setting.time_in, setting.minute_late_limit, 0, 0); // Waktu batas absen (08:00)
  const convertTimeLimit = new Date(timeLimitUTC);
  const localTimeLimit = convertTimeLimit.toLocaleString();

  // Memeriksa apakah waktu absen melebihi batas waktu yang ditentukan
  const isLate = localTime > localTimeLimit;
  // kalo telat, update count_late di recap
  if (isLate) {
    // ambil id recap dari employee
    const idRecap = await prismaClient.employee.findMany({
      where: {
        id: employee.id,
      },
      include: {
        attendance_recap: {
          select: {
            id: true,
            count_late: true,
          },
        },
      },
    });

    // update count_works + 1
    if (idRecap) {
      await prismaClient.attendanceRecap.update({
        data: {
          count_late: idRecap[0].attendance_recap[0].count_late + 1,
        },
        where: {
          id: idRecap[0].attendance_recap[0].id,
        },
      });
    } else {
      throw new ResponseError(404, "Data tidak ditemukan");
    }
  }
  // Jika tidak WFH, cek koordinat absen
  if (wfh === "false") {
    // koordinat zona geofencing kantor WGS Bandung
    const geofenceCoordinates = {
      latitude: setting.office_latitude,
      longitude: setting.office_longitude,
    };

    // Jarak maksimal untuk dianggap berada dalam zona geofencing (dalam meter)
    const geofenceRadius = setting.office_radius;

    // Memeriksa apakah karyawan berada dalam zona geofencing
    const isWithinGeofence = geolib.isPointWithinRadius(
      { latitude, longitude },
      geofenceCoordinates,
      geofenceRadius
    );

    if (!isWithinGeofence) {
      throw new ResponseError(
        400,
        "Diluar lokasi, Gagal melakukan absen masuk"
      );
    }
  }

  // ambil id recap dari employee
  const idRecap = await prismaClient.employee.findMany({
    where: {
      id: employee.id,
    },
    include: {
      attendance_recap: {
        select: {
          id: true,
          count_works: true,
        },
      },
    },
  });

  // update count_works + 1
  if (idRecap) {
    await prismaClient.attendanceRecap.update({
      data: {
        count_works: idRecap[0].attendance_recap[0].count_works + 1,
      },
      where: {
        id: idRecap[0].attendance_recap[0].id,
      },
    });
  } else {
    throw new ResponseError(404, "Data tidak ditemukan");
  }

  logger.info("EMPLOYEE ABSEN IN BERHASIL");
  return prismaClient.attendance.create({
    data: {
      time_in: currentUTCTime,
      is_late: isLate,
      is_wfh: isWfh,
      is_working: true,
      latitude_in: latitude,
      longitude_in: longitude,
      employee_id: employee.id,
    },
  });
};

// service untuk employee absen keluar
const absenOut = async (latitude, longitude, employee) => {
  const setting = await prismaClient.setting.findFirst({
    select: {
      office_radius: true,
      office_latitude: true,
      office_longitude: true,
    },
    where: {
      id: 1,
    },
  });

  // logic untuk set waktu hari ini
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set waktu ke 00:00:00.000 (mulai hari)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // tambah 1 untuk date esok hari
  tomorrow.setMilliseconds(tomorrow.getMilliseconds() - 1); // Set waktu ke 23:59:59.999 (besok sebelum pergantian hari)

  // ambil data attendance (isWFH, Id) dari employee di hari itu
  const getTodayAttendance = await prismaClient.employee.findMany({
    where: {
      id: employee.id,
    },
    include: {
      attendance: {
        select: {
          id: true,
          is_wfh: true,
        },
        where: {
          time_in: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    },
  });

  const extractedData =
    (getTodayAttendance &&
      getTodayAttendance.map((item) => {
        return {
          name: item.name,
          is_wfh: item.attendance[0].is_wfh,
          attendance_id: item.attendance[0].id,
        };
      })) ||
    [];

  const id = extractedData[0].attendance_id;

  // Jika tidak WFH, cek koordinat absen
  if (extractedData[0].is_wfh === false) {
    // koordinat zona geofencing kantor WGS Bandung
    const geofenceCoordinates = {
      latitude: setting.office_latitude,
      longitude: setting.office_longitude,
    };

    // Jarak maksimal untuk dianggap berada dalam zona geofencing (dalam meter)
    const geofenceRadius = setting.office_radius;

    // Memeriksa apakah karyawan berada dalam zona geofencing
    const isWithinGeofence = geolib.isPointWithinRadius(
      { latitude, longitude },
      geofenceCoordinates,
      geofenceRadius
    );

    if (!isWithinGeofence) {
      throw new ResponseError(
        400,
        "Diluar lokasi, Gagal melakukan absen keluar"
      );
    }
  }

  const currentUTCTime = new Date(); // set waktu sekarang dalam UTC
  logger.info("EMPLOYEE ABSEN OUT BERHASIL");
  return prismaClient.attendance.update({
    where: {
      id: id,
    },
    data: {
      time_out: currentUTCTime,
      latitude_out: latitude,
      longitude_out: longitude,
    },
  });
};

// service untuk employee upload foto profile
const upload = async (filePath, employee) => {
  logger.info("UPLOAD FOTO BERHASIL");
  //simpan ke tabel log
  const date = new Date();
  const note = `Employee ${employee.name} upload foto profile pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  // Simpan path file ke tabel
  return prismaClient.employee.update({
    where: {
      id: employee.id,
    },
    data: {
      picture: filePath,
    },
    select: {
      picture: true,
    },
  });
};

// service untuk employee create permission
const createPermission = async (request, employee, filePath) => {
  const createRequest = validate(employeeCreatePermissionValidation, request);
  // join ke tabel AttendanceRecap untuk mendapatkan id nya
  const getAttendenceRecap = await prismaClient.employee.findMany({
    where: {
      id: employee.id,
    },
    include: {
      attendance_recap: {
        select: {
          id: true,
        },
      },
    },
  });
  const extractedData =
    (getAttendenceRecap &&
      getAttendenceRecap.map((item) => {
        return {
          attendance_recap_id: item.attendance_recap[0].id,
        };
      })) ||
    [];
  const recapId = extractedData[0].attendance_recap_id;
  const currentDate = new Date();
  logger.info("CREATE PERMISSION BERHASIL");
  // simpan ke tabel log
  const note = `Employee ${employee.name} membuat permission ${createRequest.type} pada : ${currentDate}`;
  await prismaClient.log.create({
    data: {
      date: currentDate,
      note,
    },
  });
  return prismaClient.permission.create({
    data: {
      type: createRequest.type,
      note: createRequest.note,
      date: currentDate,
      is_approved: null,
      images: filePath,
      start_date: createRequest.start_date,
      end_date: createRequest.end_date,
      employee_id: employee.id,
      attendance_recap_id: recapId,
    },
  });
};

// service untuk employee melihat daftar permission
const getPermission = async (employee) => {
  // get data permission dari employee id
  const permission = await prismaClient.employee.findMany({
    where: {
      id: employee.id,
    },
    include: {
      permission: {
        select: {
          type: true,
          note: true,
          is_approved: true,
          images: true,
          start_date: true,
          end_date: true,
        },
        orderBy: {
          is_approved: "asc",
        },
      },
    },
  });
  if (!permission) throw new ResponseError(404, "Data kosong");

  // get jumlah permission yang belum di approve milik employee id
  let totalItemsNeedApproval = await prismaClient.permission.count({
    where: {
      is_approved: null,
      employee_id: employee.id,
    },
  });
  if (totalItemsNeedApproval === 0) totalItemsNeedApproval = 0;

  // get jumlah permission yang sudah di approve milik employee id
  let totalItemsApproved = await prismaClient.permission.count({
    where: {
      is_approved: true,
      employee_id: employee.id,
    },
  });
  if (totalItemsApproved === 0) totalItemsApproved = 0;

  // get jumlah permission yang ditolak milik employee id
  let totalItemsRejected = await prismaClient.permission.count({
    where: {
      is_approved: false,
      employee_id: employee.id,
    },
  });
  if (totalItemsRejected === 0) totalItemsRejected = 0;

  // ekstrak hanya data yang dibutuhkan saja
  const permissionsOnly = permission.map((employee) => employee.permission);

  if (!permissionsOnly || permissionsOnly.length === 0) {
    throw new ResponseError(404, "Data Permission kosong");
  }

  const data = permissionsOnly[0];

  logger.info("GET PERMISSION BERHASIL");

  return {
    result: data,
    status: {
      approve: totalItemsNeedApproval,
      approved: totalItemsApproved,
      rejected: totalItemsRejected,
    },
  };
};

// service untuk employee melihat status hadir hari itu
const getAttendanceByDay = async (employee) => {
  // logic untuk set waktu hari ini
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set waktu ke 00:00:00.000 (mulai hari)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // tambah 1 untuk date esok hari
  tomorrow.setMilliseconds(tomorrow.getMilliseconds() - 1); // Set waktu ke 23:59:59.999 (besok sebelum pergantian hari)

  const attendance = await prismaClient.attendance.findFirst({
    where: {
      employee_id: employee.id,
      time_in: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      time_in: true,
      time_out: true,
      is_late: true,
      is_working: true,
      is_wfh: true,
    },
  });

  // if (!attendance) throw new ResponseError(404, "Data kosong");
  // logger.info("GET ATTENDANCE RECAP BY DAY BERHASIL");
  return attendance;
};

// service untuk employee melihat daftar hadir perbulan
const getAttendanceByMonth = async (employee, targetYear, targetMonth) => {
  // menentukan awal dan akhir bulan
  const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const lastDayOfMonth = new Date(targetYear, targetMonth, 0);

  // Query the database using the date range
  try {
    const attendance = await prismaClient.attendance.findMany({
      where: {
        employee_id: employee.id,
        time_in: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      select: {
        id: true,
        time_in: true,
        time_out: true,
        is_late: true,
        is_working: true,
        is_wfh: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    // Check if there's no data
    if (!attendance || attendance.length === 0) {
      throw new ResponseError(404, "Data kosong");
    }

    logger.info("GET ATTENDANCE RECAP BY MONTH BERHASIL");
    return attendance;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getSetting = async () => {
  logger.info("GET SETTING SUKSES");
  return prismaClient.setting.findFirst({
    select: {
      office_radius: true,
      office_latitude: true,
      office_longitude: true,
      office_address: true,
      office_name: true,
      default_password: true,
      time_in: true,
      time_out: true,
      minute_late_limit: true,
      wfh_limit: true,
      leaves_limit: true,
      enable_wfh: true,
      using_shot: true,
    },
    where: {
      id: 1,
    },
  });
};

const getRecap = async (employee) => {
  const recap = prismaClient.attendanceRecap.findFirst({
    select: {
      count_leaves: true,
      count_wfh: true,
      count_works: true,
      count_permits: true,
      count_sick: true,
      count_late: true,
    },
    where: {
      employee_id: employee.id,
    },
  });
  if (!recap) throw new ResponseError(404, "Data kosong");
  logger.info("GET RECAP SUKSES");
  return recap;
};

const getShot = async () => {
  return prismaClient.setting.findFirst({
    select: {
      shot: true,
    },
    where: {
      id: 1,
    },
  });
};

const getAnnouncement = async () => {
  return prismaClient.announcement.findFirst({
    where: {
      id: 1,
    },
    select: {
      announcement: true,
      message: true,
    },
  });
};

export default {
  login,
  logout,
  reset,
  changePassword,
  detail,
  absenIn,
  absenOut,
  upload,
  createPermission,
  getPermission,
  getAttendanceByDay,
  getAttendanceByMonth,
  getSetting,
  getRecap,
  getShot,
  getAnnouncement,
};
