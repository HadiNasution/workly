/*
  Warnings:

  - You are about to drop the column `lontitude_out` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "lontitude_out",
ADD COLUMN     "longtitude_out" INTEGER,
ALTER COLUMN "longtitude_in" DROP NOT NULL,
ALTER COLUMN "latitude_in" DROP NOT NULL,
ALTER COLUMN "latitude_out" DROP NOT NULL;
