import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

const port = 3000;
// const currentDateString = new Date().toLocaleString();
// const date = new Date();
// const dataAttendance = [
//   {
//     date: date,
//     time_in: date,
//     time_out: date,
//     is_working: true,
//     is_late: true,
//     is_wfh: true,
//     is_sick: false,
//     is_leaves: false,
//     is_permits: false,
//     notes: "heheee",
//     longtitude_in: 12,
//     latitude_in: 12,
//     longtitude_out: 12,
//     latitude_out: 12,
//     employee_id: 34,
//   },
//   {
//     date: date,
//     time_in: date,
//     is_working: true,
//     is_late: false,
//     is_wfh: false,
//     is_sick: false,
//     is_leaves: false,
//     is_permits: false,
//     longtitude_in: 12,
//     latitude_in: 12,
//     longtitude_out: 12,
//     latitude_out: 12,
//     employee_id: 35,
//   },
//   {
//     date: date,
//     time_in: date,
//     is_working: false,
//     is_late: false,
//     is_wfh: false,
//     is_sick: true,
//     is_leaves: false,
//     is_permits: false,
//     notes: "demam",
//     employee_id: 36,
//   },
// ];
// const dataEmployee = [
//   {
//     name: "yusuf",
//     nip: "18304055",
//     email: "ucup@mail.com",
//     password: await bcrypt.hash("hehee", 10),
//     role: "senior dev",
//     departmen: "Dev",
//     picture: "me.jpg",
//     join_date: date,
//     admin_id: 106,
//   },
//   {
//     name: "helmi",
//     nip: "183040433",
//     email: "miii@mail.com",
//     password: await bcrypt.hash("hehee", 10),
//     role: "senior dev",
//     departmen: "Dev",
//     picture: "me.jpg",
//     join_date: date,
//     admin_id: 106,
//   },
//   {
//     name: "aul",
//     nip: "1830402333",
//     email: "aul@mail.com",
//     password: await bcrypt.hash("hehee", 10),
//     role: "junior dev",
//     departmen: "Dev",
//     picture: "me.jpg",
//     join_date: date,
//     admin_id: 106,
//   },
// ];
// const dataRecap = [
//   {
//     date: date,
//     count_sick: 2,
//     count_permits: 0,
//     count_leaves: 3,
//     count_wfh: 2,
//     count_works: 2,
//     count_late: 2,
//     notes: "",
//     employee_id: 34,
//   },
//   {
//     date: date,
//     count_sick: 4,
//     count_permits: 0,
//     count_leaves: 3,
//     count_wfh: 2,
//     count_works: 2,
//     count_late: 2,
//     notes: "",
//     employee_id: 35,
//   },
//   {
//     date: date,
//     count_sick: 5,
//     count_permits: 0,
//     count_leaves: 3,
//     count_wfh: 2,
//     count_works: 2,
//     count_late: 2,
//     notes: "",
//     employee_id: 36,
//   },
// ];
// const insertData = async () => {
//   await prismaClient.attendanceRecap.createMany({
//     data: dataRecap,
//   });
// };
web.listen(port, async () => {
  // await insertData();
  logger.info(`App is listening on port ${port}...`);
});
