import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  employeeLoginValidation,
  employeeGetValidation,
  employeeResetValidation,
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { generate } from "random-words";
import geolib from "geolib";

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

  const currentDate = new Date();
  if (!employee.token_expires_at || currentDate > employee.token_expires_at) {
    const expirationTime = addMinutes(currentDate, 120);
    const timeZone = "Asia/Jakarta";

    const localizedExpirationTime = utcToZonedTime(expirationTime, timeZone);

    const formattedExpirationTime = format(
      localizedExpirationTime,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      { timeZone }
    );

    const newToken = uuid().toString();

    return prismaClient.employee.update({
      data: {
        token: newToken,
        token_expires_at: formattedExpirationTime,
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
  const isAccountExist = await prismaClient.admin.count({
    where: {
      name: resetRequest.name,
      nip: resetRequest.nip,
      email: resetRequest.email,
    },
  });

  if (!isAccountExist) throw new ResponseError(400, "Akun tidak terdaftar");

  const dummyPass = generate({ minLength: 6, maxLength: 10 });

  await prismaClient.employee.update({
    where: {
      email: resetRequest.email,
    },
    data: {
      password: await bcrypt.hash(dummyPass, 10),
      token: null,
      token_expires_at: null,
    },
  });

  return dummyPass;
};

const absenIn = async (request, id) => {
  const absenRequest = validate(employeeAbsenInValidation, request);

  const latitude = absenRequest.latitude_in;
  const longitude = absenRequest.longitude_in;

  // koordinat zona geofencing kantor WGS Bandung
  const geofenceCoordinates = {
    latitude: -6.93558818718933,
    longitude: 107.57824313682035,
  };

  // Jarak maksimal untuk dianggap berada dalam zona geofencing (dalam meter)
  const geofenceRadius = 50;

  // Memeriksa apakah karyawan berada dalam zona geofencing
  const isWithinGeofence = geolib.isPointWithinRadius(
    { latitude, longitude },
    geofenceCoordinates,
    geofenceRadius
  );

  if (!isWithinGeofence)
    throw new ResponseError(400, "Gagal melakukan absen masuk");

  const currentTime = new Date();
  const absenTimeLimit = new Date();
  absenTimeLimit.setHours(8, 0, 0, 0); // Waktu batas absen (08:00)

  // Memeriksa apakah waktu absen melebihi batas waktu yang ditentukan
  const isLate = currentTime > absenTimeLimit;

  return prismaClient.attendance.create({
    data: {
      time_in: currentTime,
      is_late: isLate,
      is_working: true,
      employee_id: id,
    },
  });
};

export default { login, logout, reset, absenIn };
