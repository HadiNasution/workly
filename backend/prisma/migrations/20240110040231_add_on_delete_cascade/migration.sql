-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecap" DROP CONSTRAINT "AttendanceRecap_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_attendance_recap_id_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_employee_id_fkey";

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecap" ADD CONSTRAINT "AttendanceRecap_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_attendance_recap_id_fkey" FOREIGN KEY ("attendance_recap_id") REFERENCES "AttendanceRecap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
