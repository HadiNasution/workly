import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
  employeeAbsenInValidation,
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";
import { generate } from "random-words";
import geolib from "geolib";
import { logger } from "../app/logging.js";

const login = async (request) => {
  const loginRequest = validate(employeeLoginValidation, request);

  const employee = await prismaClient.employee.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
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
    return prismaClient.employee.update({
      data: {
        token: newToken,
        token_expires_at: expiredUTCTime,
      },
      where: {
        email: employee.email,
      },
      select: {
        token: true,
        token_expires_at: true,
      },
    });
  }
  logger.info("EMPLOYE LOGIN BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${loginRequest.name} login pada : ${date}`;
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
      token: true,
      token_expires_at: true,
    },
  });
};

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

const reset = async (request) => {
  const resetRequest = validate(employeeResetValidation, request);

  const employee = await prismaClient.employee.findUnique({
    where: {
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

const shot = async () => {
  const generateShot = await prismaClient.shot.update({
    data: {
      shot: generate({ minLength: 2, maxLength: 10 }),
    },
    where: {
      id: 1,
    },
    select: {
      shot: true,
    },
  });
  if (!generateShot) throw new ResponseError(404, "Shot belum tersedia");
  return generateShot;
};

const absenIn = async (request, employee) => {
  const absenRequest = validate(employeeAbsenInValidation, request);

  const currentUTCTime = new Date(); // set waktu sekarang dalam UTC
  const convertCurrent = new Date(currentUTCTime); // convert UTC ke lokal
  const localTime = convertCurrent.toLocaleString(); // waktu sekarang dalam lokal

  const timeLimitUTC = new Date();
  timeLimitUTC.setHours(8, 0, 0, 0); // Waktu batas absen (08:00)
  const convertTimeLimit = new Date(timeLimitUTC);
  const localTimeLimit = convertTimeLimit.toLocaleString();

  // Memeriksa apakah waktu absen melebihi batas waktu yang ditentukan
  const isLate = localTime > localTimeLimit;

  // Jika tidak WFH, cek koordinat absen
  if (absenRequest.is_wfh === false) {
    const latitude = absenRequest.latitude_in;
    const longitude = absenRequest.longitude_in;

    // koordinat zona geofencing kantor WGS Bandung
    const geofenceCoordinates = {
      latitude: -6.935783427330478,
      longitude: 107.57826439241717,
    };

    // Jarak maksimal untuk dianggap berada dalam zona geofencing (dalam meter)
    const geofenceRadius = 5;

    // Memeriksa apakah karyawan berada dalam zona geofencing
    const isWithinGeofence = geolib.isPointWithinRadius(
      { latitude, longitude },
      geofenceCoordinates,
      geofenceRadius
    );

    if (!isWithinGeofence) {
      throw new ResponseError(400, "Gagal melakukan absen masuk");
    }
  }

  logger.info("EMPLOYEE ABSEN IN BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Employee ${absenRequest.name} absen masuk pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.attendance.create({
    data: {
      time_in: currentUTCTime,
      is_late: isLate,
      is_wfh: absenRequest.is_wfh,
      is_working: true,
      latitude_in: absenRequest.latitude_in,
      longitude_in: absenRequest.longitude_in,
      employee_id: employee.id,
    },
  });
};

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

export default { login, logout, reset, absenIn, detail, shot };
