/*
  Warnings:

  - You are about to drop the column `date` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `is_leaves` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `is_permits` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `is_sick` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "date",
DROP COLUMN "is_leaves",
DROP COLUMN "is_permits",
DROP COLUMN "is_sick",
DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "attendance_recap_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_attendance_recap_id_fkey" FOREIGN KEY ("attendance_recap_id") REFERENCES "AttendanceRecap"("id") ON DELETE SET NULL ON UPDATE CASCADE;
