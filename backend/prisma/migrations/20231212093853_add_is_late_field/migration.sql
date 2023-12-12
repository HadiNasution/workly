-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "is_late" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "AttendanceRecap" ADD COLUMN     "count_late" INTEGER;
