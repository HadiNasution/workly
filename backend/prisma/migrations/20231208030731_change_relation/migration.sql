-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceRecap" DROP CONSTRAINT "AttendanceRecap_employee_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AttendanceRecap" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecap" ADD CONSTRAINT "AttendanceRecap_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
