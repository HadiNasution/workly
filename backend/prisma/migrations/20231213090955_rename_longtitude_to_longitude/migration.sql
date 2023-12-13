/*
  Warnings:

  - You are about to drop the column `longtitude_in` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `longtitude_out` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "longtitude_in",
DROP COLUMN "longtitude_out",
ADD COLUMN     "longitude_in" INTEGER,
ADD COLUMN     "longitude_out" INTEGER;
