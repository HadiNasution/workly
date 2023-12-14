/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `attendance_id` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Log` table. All the data in the column will be lost.
  - Added the required column `note` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "admin_id",
DROP COLUMN "attendance_id",
DROP COLUMN "employee_id",
DROP COLUMN "message",
ADD COLUMN     "admin" VARCHAR(16),
ADD COLUMN     "attendance" VARCHAR(16),
ADD COLUMN     "employee" VARCHAR(16),
ADD COLUMN     "note" VARCHAR(255) NOT NULL,
ADD COLUMN     "permission" VARCHAR(16);
