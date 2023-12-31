import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  adminGetValidation,
  adminLoginValidation,
  adminRegistValidation,
  adminResetValidation,
  createAdminValidation,
  adminUpdateValidation,
  adminUpdateEmployeeValidation,
  adminSearchEmployeeValidation,
  adminUpdateSetting,
  changePasswordValidation,
  adminCreateAnnouncementValidation,
} from "../validation/admin-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";
import { generate } from "random-words";
import { logger } from "../app/logging.js";
import { createObjectCsvWriter } from "csv-writer";

// service untuk login admin dan superadmin
const login = async (request) => {
  // 1. Validasi format request
  const loginRequest = validate(adminLoginValidation, request);

  // 2. Get data admin dari database untuk validasi email dan Password
  const admin = await prismaClient.admin.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      nip: true,
      name: true,
      email: true,
      password: true,
      token: true,
      token_expires_at: true,
    },
  });

  // jika email tidak ditemukan didatabase, maka berikan pesan error 401
  if (!admin) throw new ResponseError(401, "Email tidak ditemukan");

  // lalu validasi password dengan bcrypt.compare
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    admin.password
  );

  // jika validasi password gagal, maka berikan pesan error 401
  if (!isPasswordValid) throw new ResponseError(401, "Password tidak valid");

  // Cek apakah token masih valid, Jika tidak generate token baru. Jika masih valid kembalikan data admin
  const currentUTCTime = new Date();
  const convertCurrent = new Date(currentUTCTime);
  const localCurrentTime = convertCurrent.toLocaleString();

  const convertExpires = new Date(admin.token_expires_at);
  const localExpires = convertExpires.toLocaleString();
  if (!admin.token_expires_at || localCurrentTime > localExpires) {
    const expiredUTCTime = addMinutes(currentUTCTime, 540);

    // Generate token baru
    const newToken = uuid().toString();

    logger.info("LOGIN ADMIN BERHASIL (WITH NEW TOKEN)");
    // // simpan ke tabel log
    const note = `Admin ${admin.name} Login pada : ${localCurrentTime}. Dengan token baru.`;
    await prismaClient.log.create({
      data: {
        date: currentUTCTime,
        note,
      },
    });
    // update data admin dengan token baru yang valid
    return prismaClient.admin.update({
      data: {
        token: newToken,
        token_expires_at: expiredUTCTime,
      },
      where: {
        email: admin.email,
      },
      select: {
        nip: true,
        name: true,
        email: true,
        is_super_admin: true,
        token: true,
        token_expires_at: true,
      },
    });
  }
  logger.info("LOGIN ADMIN BERHASIL");
  // // simpan ke tabel log
  const note = `Admin ${admin.name} Login pada : ${localCurrentTime}`;
  await prismaClient.log.create({
    data: {
      date: currentUTCTime,
      note,
    },
  });
  return prismaClient.admin.findUnique({
    where: {
      email: admin.email,
    },
    select: {
      nip: true,
      name: true,
      email: true,
      is_super_admin: true,
      token: true,
      token_expires_at: true,
    },
  });
};

// service untuk regist admin by superadmin
const regist = async (request) => {
  const registRequest = validate(adminRegistValidation, request);

  const isNipDuplicate = await prismaClient.admin.count({
    where: {
      nip: registRequest.nip,
    },
  });
  const isEmailDuplicate = await prismaClient.admin.count({
    where: {
      email: registRequest.email,
    },
  });

  if (isNipDuplicate === 1) throw new ResponseError(400, "NIP Sudah ada");
  if (isEmailDuplicate === 1) throw new ResponseError(400, "Email Sudah ada");

  registRequest.password = await bcrypt.hash(registRequest.password, 10);

  logger.info("ADMIN REGIST BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `${registRequest.name} Registrasi pada : ${date} sebagai Admin`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.admin.create({
    data: registRequest,
    select: {
      name: true,
      nip: true,
      email: true,
    },
  });
};

// service untuk admin dan superadmin logout
const logout = async (email) => {
  email = validate(adminGetValidation, email);

  const isEmailExist = await prismaClient.admin.findUnique({
    where: {
      email: email,
    },
  });

  if (!isEmailExist) throw new ResponseError(400, "Admin tidak ditemukan");
  logger.info("ADMIN LOGOUT BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin ${email} Logout pada : ${date}.`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.admin.update({
    data: {
      token: null,
      token_expires_at: null,
    },
    where: {
      email: email,
    },
  });
};

// service untuk admin dan superadmin reset password
const reset = async (request) => {
  const resetRequest = validate(adminResetValidation, request);

  const admin = await prismaClient.admin.findUnique({
    where: {
      email: resetRequest.email,
    },
  });

  if (!admin) {
    throw new ResponseError(400, "Akun tidak terdaftar");
  }

  const dummyPass = generate({ minLength: 6, maxLength: 10 });

  const updateAdminPass = await prismaClient.admin.update({
    data: {
      password: await bcrypt.hash(dummyPass.toString(), 10),
    },
    where: {
      email: resetRequest.email,
    },
  });
  logger.info("RESET PASSWORD ADMIN BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin ${resetRequest.name} Reset password pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  if (updateAdminPass) return dummyPass;
};

// service untuk admin ganti password
const changePassword = async (request, admin) => {
  const changeRequest = validate(changePasswordValidation, request);
  const newPassword = await bcrypt.hash(changeRequest.password, 10);
  await prismaClient.admin.update({
    data: {
      password: newPassword,
    },
    where: {
      id: admin.id,
    },
  });
  logger.info("GANTI PASSWORD ADMIN BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `ADMIN ${admin.name} ganti password pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
};

// service untuk admin dan superadmin melihat daftar semua admin dan superadmin
const get = async () => {
  const admins = await prismaClient.admin.findMany({
    select: {
      id: true,
      name: true,
      nip: true,
      email: true,
      is_super_admin: true,
    },
    orderBy: {
      is_super_admin: "desc",
    },
  });

  if (!admins) throw new ResponseError(404, "Data Admin kosong");
  return admins;
};

// service untuk admin get data admin by id
const getAdminById = async (adminId) => {
  const id = parseInt(adminId);
  const admins = await prismaClient.admin.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      nip: true,
      email: true,
      is_super_admin: true,
    },
  });

  if (!admins) throw new ResponseError(404, "Data Admin kosong");
  return admins;
};

// service untuk admin dan superadmin update data admin lain
const update = async (request) => {
  const updateRequest = validate(adminUpdateValidation, request);
  const id = parseInt(updateRequest.id);

  // get data lama
  const oldData = await prismaClient.admin.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      nip: true,
      email: true,
      is_super_admin: true,
    },
  });

  if (!oldData) throw new ResponseError(404, "Admin tidak ditemukan");

  // Cek apakah email baru sudah dipakai
  if (updateRequest.email && updateRequest.email !== oldData.email) {
    const existingUserWithEmail = await prismaClient.admin.findUnique({
      where: {
        email: updateRequest.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUserWithEmail) {
      throw new ResponseError(400, "Email sudah digunakan oleh pengguna lain");
    }
  }

  // Cek apakah nip baru sudah dipakai
  if (updateRequest.nip && updateRequest.nip !== oldData.nip) {
    const existingUserWithNip = await prismaClient.admin.findUnique({
      where: {
        nip: updateRequest.nip,
      },
      select: {
        id: true,
      },
    });

    if (existingUserWithNip) {
      throw new ResponseError(400, "NIP sudah digunakan oleh pengguna lain");
    }
  }

  // kondisi jika admin hanya update beberapa field
  // jika name diupdate, pakai data baru jika tidak pakai data lama dari oldData
  const newName = updateRequest.name ? updateRequest.name : oldData.name;
  const newNip = updateRequest.nip ? updateRequest.nip : oldData.nip;
  const newEmail = updateRequest.email ? updateRequest.email : oldData.email;

  logger.info("UPDATE ADMIN BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin ${updateRequest.name} Update data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.admin.update({
    data: {
      name: newName,
      nip: newNip,
      email: newEmail,
      is_super_admin: updateRequest.is_super_admin,
    },
    where: {
      id,
    },
  });
};

// service untuk admin dan superadmin delete admin
const deleteAdmin = async (adminNip) => {
  const admin = await prismaClient.admin.delete({
    where: {
      nip: adminNip,
    },
  });
  if (!admin) throw new ResponseError(404, "Admin tidak ditemukan");
  logger.info("DELETE EMPLOYEE BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin hapus data admin ${adminNip} (nip) pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return admin;
};

// service untuk admin menambahkan employee
const createEmployee = async (request, admin) => {
  const createRequest = validate(createAdminValidation, request);

  const isNipDuplicate = await prismaClient.employee.count({
    where: {
      nip: createRequest.nip,
    },
  });
  const isEmailDuplicate = await prismaClient.employee.count({
    where: {
      email: createRequest.email,
    },
  });

  if (isNipDuplicate === 1) throw new ResponseError(400, "NIP Sudah ada");
  if (isEmailDuplicate === 1) throw new ResponseError(400, "Email Sudah ada");

  // ambil password default dari table setting
  const defaultPass = await prismaClient.setting.findFirst({
    where: {
      id: 1,
    },
    select: {
      default_password: true,
    },
  });

  const pass = defaultPass.default_password.toString();

  // create user
  await prismaClient.employee.create({
    data: {
      name: createRequest.name,
      nip: createRequest.nip,
      email: createRequest.email,
      password: await bcrypt.hash(pass, 10), // password default
      role: createRequest.role,
      departmen: createRequest.departmen,
      join_date: createRequest.join_date,
      quit_date: createRequest.quit_date,
      admin_id: admin.id,
    },
    select: {
      name: true,
      nip: true,
      email: true,
      role: true,
      departmen: true,
      join_date: true,
      quit_date: true,
    },
  });

  // ambil id user yang baru ditambahkan
  const newEmployeeId = await prismaClient.employee.findUnique({
    where: {
      nip: createRequest.nip,
    },
    select: {
      id: true,
    },
  });

  logger.info("CREATE EMPLOYEE BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin ${admin.name} Create employee ${createRequest.name} data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });

  // create recap untuk user baru
  const currentDate = new Date();
  return prismaClient.attendanceRecap.create({
    data: {
      date: currentDate,
      employee_id: newEmployeeId.id,
    },
  });
};

// service untuk admin melihat daftar semua employee
const getEmployee = async () => {
  const employee = await prismaClient.employee.findMany({
    include: {
      attendance_recap: {
        select: {
          count_late: true,
          count_sick: true,
          count_leaves: true,
          count_permits: true,
          count_wfh: true,
          count_works: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!employee || employee.length === 0)
    throw new ResponseError(404, "Pegawai tidak ditemukan");

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (employee &&
      employee.map((item) => {
        return {
          id: item.id,
          name: item.name,
          nip: item.nip,
          email: item.email,
          role: item.role,
          departmen: item.departmen,
          picture: item.picture,
          join: item.join_date,
          quit: item.quit_date,
          late: item.attendance_recap[0].count_late,
          sick: item.attendance_recap[0].count_sick,
          permits: item.attendance_recap[0].count_permits,
          leaves: item.attendance_recap[0].count_leaves,
          wfh: item.attendance_recap[0].count_wfh,
          works: item.attendance_recap[0].count_works,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  logger.info("RESPONSE GET DETAIL EMPLOYEE BERHASIL");
  return extractedData;
};

// service untuk admin update data employee
const updateEmployee = async (request) => {
  const updateRequest = validate(adminUpdateEmployeeValidation, request);
  const id = parseInt(updateRequest.id);
  // get data lama
  const oldData = await prismaClient.employee.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      nip: true,
      email: true,
      role: true,
      departmen: true,
      join_date: true,
      quit_date: true,
    },
  });

  if (!oldData) throw new ResponseError(404, "employee tidak ditemukan");

  // Cek apakah email baru sudah dipakai
  if (updateRequest.email && updateRequest.email !== oldData.email) {
    const existingUserWithEmail = await prismaClient.employee.findUnique({
      where: {
        email: updateRequest.email,
      },
      select: {
        id: true,
      },
    });

    if (existingUserWithEmail) {
      throw new ResponseError(400, "Email sudah digunakan oleh pengguna lain");
    }
  }

  // Cek apakah nip baru sudah dipakai
  if (updateRequest.nip && updateRequest.nip !== oldData.nip) {
    const existingUserWithNip = await prismaClient.employee.findUnique({
      where: {
        nip: updateRequest.nip,
      },
      select: {
        id: true,
      },
    });

    if (existingUserWithNip) {
      throw new ResponseError(400, "NIP sudah digunakan oleh pengguna lain");
    }
  }

  // kondisi jika admin hanya update beberapa field
  // jika name diupdate, pakai data baru jika tidak pakai data lama dari oldData
  const newName = updateRequest.name ? updateRequest.name : oldData.name;
  const newNip = updateRequest.nip ? updateRequest.nip : oldData.nip;
  const newEmail = updateRequest.email ? updateRequest.email : oldData.email;
  const newRole = updateRequest.role ? updateRequest.role : oldData.role;
  const newDepartmen = updateRequest.departmen
    ? updateRequest.departmen
    : oldData.departmen;
  const newJoinDate = updateRequest.join_date
    ? updateRequest.join_date
    : oldData.join_date;
  const newQuitDate = updateRequest.quit_date
    ? updateRequest.quit_date
    : oldData.quit_date;

  logger.info("UPDATE BERHASIL");
  // simpan ke tabel log
  const date = new Date();
  const note = `Admin update data employee ${oldData.name} data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.employee.update({
    data: {
      name: newName,
      nip: newNip,
      email: newEmail,
      role: newRole,
      departmen: newDepartmen,
      join_date: newJoinDate,
      quit_date: newQuitDate,
    },
    where: {
      id,
    },
  });
};

// service untuk delete employee
const deleteEmployee = async (employeeNip) => {
  const employee = await prismaClient.employee.delete({
    where: {
      nip: employeeNip,
    },
  });
  if (!employee) throw new ResponseError(404, "Pegawai tidak ditemukan");
  logger.info("DELETE EMPLOYEE BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin Delete data employee ${employeeNip} (nip) data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return employee;
};

// service untuk melihat detail employee dan rekap kehadiran employee
const getEmployeeById = async (employeeId) => {
  const id = parseInt(employeeId);
  const employee = await prismaClient.employee.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nip: true,
      name: true,
      email: true,
      role: true,
      departmen: true,
      join_date: true,
      quit_date: true,
    },
  });

  if (!employee || employee.length === 0)
    throw new ResponseError(404, "Pegawai tidak ditemukan");

  logger.info("RESPONSE GET EMPLOYEE ID BERHASIL");
  return employee;
};

// service untuk melihat rekap kehadiran pada hari itu
const attendanceRecapByDay = async () => {
  // logic untuk set waktu hari ini
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set waktu ke 00:00:00.000 (mulai hari)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // tambah 1 untuk date esok hari
  tomorrow.setMilliseconds(tomorrow.getMilliseconds() - 1); // Set waktu ke 23:59:59.999 (besok sebelum pergantian hari)

  const attendance = await prismaClient.attendance.findMany({
    where: {
      time_in: {
        gte: today, //greather than
        lt: tomorrow, // less than
      },
    },
    orderBy: {
      time_in: "desc", // paling terakhir absen, akan paling atas (saat di view)
    },
    include: {
      // ambil data di tabel employee juga
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          picture: true,
          role: true,
          departmen: true,
        },
      },
    },
  });

  if (!attendance || attendance.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (attendance &&
      attendance.map((item) => {
        return {
          date: item.date,
          time_in: item.time_in,
          time_out: item.time_out,
          is_late: item.is_late,
          is_working: item.is_working,
          is_wfh: item.is_wfh,
          is_sick: item.is_sick,
          is_leaves: item.is_leaves,
          is_permits: item.is_permits,
          employee_id: item.employee ? item.employee.id : null,
          nip: item.employee ? item.employee.nip : null,
          name: item.employee ? item.employee.name : null,
          picture: item.employee ? item.employee.picture : null,
          role: item.employee ? item.employee.role : null,
          departmen: item.employee ? item.employee.departmen : null,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }
  logger.info("RESPONSE ATTENDANCE RECAP DAY BERHASIL");
  return extractedData;
};

// service untuk melihat rekap kehadiran perbulan
const attendanceRecapByMonth = async (targetYear, targetMonth) => {
  // Menentukan awal dan akhir bulan
  const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const lastDayOfMonth = new Date(targetYear, targetMonth, 0);

  const attendance = await prismaClient.attendanceRecap.findMany({
    where: {
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
    orderBy: {
      count_works: "desc", // yang paling sedikit total kerja paling ataas
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          email: true,
          picture: true,
        },
      },
    },
  });

  if (!attendance || attendance.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (attendance &&
      attendance.map((item) => {
        return {
          count_late: item.count_late,
          count_sick: item.count_sick,
          count_permits: item.count_permits,
          count_leaves: item.count_leaves,
          count_wfh: item.count_wfh,
          count_works: item.count_works,
          employee_id: item.employee ? item.employee.id : null,
          nip: item.employee ? item.employee.nip : null,
          name: item.employee ? item.employee.name : null,
          email: item.employee ? item.employee.email : null,
          picture: item.employee ? item.employee.picture : null,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }
  logger.info("RESPONSE ATTENDANCE RECAP MONTH BERHASIL");
  return extractedData;
};

// service untuk mencari data karyawan
const searchEmployee = async (request) => {
  const searchRequest = validate(adminSearchEmployeeValidation, request);

  // 1 = (page-1) * 10 = 0
  // 2 = (page-1) * 10 = 10
  const skip = (searchRequest.page - 1) * searchRequest.size;

  const filter = []; // akan menampung objek dari query search

  // logic untuk search degan query optional
  if (searchRequest.nip) {
    filter.push({
      OR: [
        {
          nip: {
            contains: searchRequest.nip,
          },
        },
      ],
    });
  }

  if (searchRequest.name) {
    filter.push({
      OR: [
        {
          name: {
            contains: searchRequest.name,
          },
        },
      ],
    });
  }

  if (searchRequest.email) {
    filter.push({
      OR: [
        {
          email: {
            contains: searchRequest.email,
          },
        },
      ],
    });
  }

  const employee = await prismaClient.employee.findMany({
    where: {
      AND: filter,
    },
    take: searchRequest.size,
    skip: skip,
  });

  if (!employee) throw new ResponseError(404, "Data kosong");

  const totalItems = await prismaClient.employee.count({
    where: {
      AND: filter,
    },
  });

  if (totalItems === 0) throw new ResponseError(404, "Item kosong");

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (employee &&
      employee.map((item) => {
        return {
          id: item.id,
          name: item.name,
          nip: item.nip,
          email: item.email,
          role: item.role ? item.role : null,
          departmen: item.departmen ? item.departmen : null,
          picture: item.picture ? item.picture : null,
          join_date: item.join_date,
          quit_date: item.quit_date ? item.quit_date : null,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }
  logger.info("RESPONSE SEARCH EMPLOYEE BERHASIL");
  return {
    result: extractedData,
    paging: {
      page: searchRequest.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / searchRequest.size),
    },
  };
};

// service untuk get semua permission
const getPermission = async () => {
  const permission = await prismaClient.permission.findMany({
    orderBy: {
      is_approved: "asc", // yang belum di approve akan paling atas
    },
    include: {
      employee: {
        select: {
          name: true,
          nip: true,
          email: true,
        },
      },
    },
  });

  if (!permission) throw new ResponseError(404, "Data kosong");

  // jumlah permission yang belum di approve
  let totalItemsNeedApproval = await prismaClient.permission.count({
    where: {
      is_approved: null,
    },
  });
  if (totalItemsNeedApproval === 0) totalItemsNeedApproval = 0;

  // jumlah permission yang sudah di reject
  let totalItemsRejected = await prismaClient.permission.count({
    where: {
      is_approved: false,
    },
  });
  if (totalItemsRejected === 0) totalItemsRejected = 0;

  // jumlah permission yang sudah di approve
  let totalItemsApproved = await prismaClient.permission.count({
    where: {
      is_approved: true,
    },
  });
  if (totalItemsApproved === 0) totalItemsApproved = 0;

  // ekstrak hayan data yang dibutuhkan FE saja
  const extractedData =
    (permission &&
      permission.map((item) => {
        return {
          id: item.id,
          type: item.type,
          note: item.note ? item.note : "",
          is_approved: item.is_approved,
          images: item.images ? item.images : null,
          start_date: item.start_date ? item.start_date : null,
          end_date: item.end_date ? item.end_date : null,
          name: item.employee.name,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }
  logger.info("RESPONSE GET PERMISSION BERHASIL");
  return {
    result: extractedData,
    status: {
      approve: totalItemsNeedApproval,
      approved: totalItemsApproved,
      rejected: totalItemsRejected,
    },
  };
};

// service untuk approve permission
const approvePermission = async (permissionId, admin) => {
  const id = parseInt(permissionId);

  try {
    // Lakukan transaksi untuk approve permission
    await prismaClient.$transaction(async (prismaClient) => {
      // Ambil data dari tabel Permission
      const permissionData = await prismaClient.permission.findUnique({
        where: {
          id,
        },
        select: {
          type: true,
          attendance_recap_id: true,
        },
      });

      // Lakukan perubahan pada data Permission
      if (permissionData) {
        await prismaClient.permission.update({
          where: {
            id,
          },
          data: {
            is_approved: true,
            admin_id: admin.id,
          },
        });
      }

      // Ambil data dari tabel AttendanceRecap berdasarkan relasi
      const attendanceRecapData = await prismaClient.permission
        .findUnique({
          where: {
            id,
          },
        })
        .attendance_recap();

      // logic untuk set field berdasarkan type dari permission
      let permissionType;
      if (permissionData.type === "sakit") {
        permissionType = {
          count_sick: attendanceRecapData.count_sick + 1,
        };
      }
      if (permissionData.type === "izin") {
        permissionType = {
          count_permits: attendanceRecapData.count_permits + 1,
        };
      }
      if (permissionData.type === "wfh") {
        permissionType = {
          count_wfh: attendanceRecapData.count_wfh + 1,
        };
      }
      if (permissionData.type === "cuti") {
        permissionType = {
          count_leaves: attendanceRecapData.count_leaves + 1,
        };
      }

      // Lakukan perubahan pada data AttendanceRecap
      if (attendanceRecapData) {
        await prismaClient.attendanceRecap.update({
          where: {
            id: permissionData.attendance_recap_id,
          },
          data: permissionType,
        });
      }
    });

    logger.info("TRANSAKSI APPROVE PERMISSION BERHASIL");
    // // simpan ke tabel log
    const date = new Date();
    const note = `Admin ${admin.name} approve permission ${permissionId} (id) data pada : ${date}`;
    await prismaClient.log.create({
      data: {
        date,
        note,
      },
    });
    return true;
  } catch (error) {
    logger.info("TRANSAKSI APPROVE PERMISSION GAGAL : " + error);
    return false;
  }
};

// service untuk reject permission
const rejectPermission = async (permissionId, admin) => {
  const id = parseInt(permissionId);
  const permission = await prismaClient.permission.update({
    data: {
      is_approved: false,
      admin_id: admin.id,
    },
    where: {
      id,
    },
  });

  if (!permission) throw new ResponseError(404, "Data kosong");
  logger.info("RESPONSE REJECT PERMISSION BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin ${admin.name} reject permission ${permissionId} (id) data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return permission;
};

const log = async (targetYear, targetMonth) => {
  // Menentukan awal dan akhir bulan
  const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const lastDayOfMonth = new Date(targetYear, targetMonth, 0);
  const result = await prismaClient.log.findMany({
    where: {
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
    },
    select: {
      date: true,
      note: true,
      is_error: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (!result || result.length === 0)
    throw new ResponseError(404, "Data kosong");

  logger.info("RESPONSE LOG BERHASIL");
  return result;
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

const updateSetting = async (request) => {
  const settingUpdateRequest = validate(adminUpdateSetting, request);

  // get data lama
  const oldData = await prismaClient.setting.findFirst({
    where: {
      id: 1,
    },
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
  });

  if (!oldData) throw new ResponseError(404, "Data kosong");

  const newRadius = settingUpdateRequest.office_radius ?? oldData.office_radius;
  const newLatitude =
    settingUpdateRequest.office_latitude ?? oldData.office_latitude;
  const newLongitude =
    settingUpdateRequest.office_longitude ?? oldData.office_longitude;
  const newAddress =
    settingUpdateRequest.office_address ?? oldData.office_address;
  const newName = settingUpdateRequest.office_name ?? oldData.office_name;
  const newDefaultPass =
    settingUpdateRequest.default_password ?? oldData.default_password;
  const newTimeIn = settingUpdateRequest.time_in ?? oldData.time_in;
  const newTimeOut = settingUpdateRequest.time_out ?? oldData.time_out;
  const newLateLimit =
    settingUpdateRequest.minute_late_limit ?? oldData.minute_late_limit;
  const newWfhLimit = settingUpdateRequest.wfh_limit ?? oldData.wfh_limit;
  const newLeavesLimit =
    settingUpdateRequest.leaves_limit ?? oldData.leaves_limit;
  const newEnableWfh = settingUpdateRequest.enable_wfh ?? oldData.enable_wfh;
  const newUsingShow = settingUpdateRequest.using_shot ?? oldData.using_shot;

  logger.info("UPDATE SETTING BERHASIL");
  // // simpan ke tabel log
  const date = new Date();
  const note = `Admin update setting aplikasi data pada : ${date}`;
  await prismaClient.log.create({
    data: {
      date,
      note,
    },
  });
  return prismaClient.setting.update({
    data: {
      office_radius: newRadius,
      office_latitude: newLatitude,
      office_longitude: newLongitude,
      office_address: newAddress,
      office_name: newName,
      default_password: newDefaultPass,
      time_in: newTimeIn,
      time_out: newTimeOut,
      minute_late_limit: newLateLimit,
      wfh_limit: newWfhLimit,
      leaves_limit: newLeavesLimit,
      enable_wfh: newEnableWfh,
      using_shot: newUsingShow,
    },
    where: {
      id: 1,
    },
  });
};

const generateShot = async () => {
  return prismaClient.setting.update({
    data: {
      shot: generate({ minLength: 3, maxLength: 10 }),
    },
    select: {
      shot: true,
    },
    where: {
      id: 1,
    },
  });
};

const downloadRecap = async () => {
  // get data recap dan karyawan
  const data = await prismaClient.attendanceRecap.findMany({
    include: {
      employee: {
        select: {
          name: true,
          nip: true,
        },
      },
    },
  });

  if (!data || data.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  const extractedData =
    (data &&
      data.map((item, index) => {
        return {
          no: index,
          late: item.count_late,
          sick: item.count_sick,
          permits: item.count_permits,
          leaves: item.count_leaves,
          wfh: item.count_wfh,
          works: item.count_works,
          name: item.employee.name,
          nip: item.employee.nip,
        };
      })) ||
    [];

  if (!extractedData || extractedData.length === 0) {
    throw new ResponseError(404, "Data kosong");
  }

  const csvWriter = createObjectCsvWriter({
    path: "attendance-recap.csv",
    header: [
      { id: "no", title: "Nomor" },
      { id: "name", title: "Name" },
      { id: "nip", title: "NIP" },
      { id: "late", title: "Total Terlambat" },
      { id: "sick", title: "Total Sakit" },
      { id: "permits", title: "Total Izin" },
      { id: "leaves", title: "Total Cuti" },
      { id: "wfh", title: "Total WFH" },
      { id: "works", title: "Total Hadir" },
    ],
  });

  if (!csvWriter || csvWriter.length === 0) {
    throw new ResponseError(400, "CSV gagal dibuat");
  }

  return csvWriter.writeRecords(extractedData);
};

const createAnnouncement = async (request) => {
  const createRequest = validate(adminCreateAnnouncementValidation, request);

  const oldData = await prismaClient.announcement.findFirst({
    where: {
      id: 1,
    },
    select: {
      announcement: true,
      message: true,
    },
  });

  const announcement = createRequest.announcement ?? oldData.announcement;
  const message = createRequest.message ?? oldData.message;

  return await prismaClient.announcement.update({
    data: {
      announcement,
      message,
    },
    where: {
      id: 1,
    },
    select: {
      announcement: true,
      message: true,
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
  regist,
  logout,
  reset,
  changePassword,
  get,
  getAdminById,
  createEmployee,
  update,
  deleteAdmin,
  getEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  attendanceRecapByDay,
  attendanceRecapByMonth,
  searchEmployee,
  getPermission,
  approvePermission,
  rejectPermission,
  log,
  updateSetting,
  getSetting,
  generateShot,
  downloadRecap,
  createAnnouncement,
  getAnnouncement,
};
