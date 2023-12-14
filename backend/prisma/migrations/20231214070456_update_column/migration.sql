/*
  Warnings:

  - You are about to drop the column `admin` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `attendance` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `employee` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `permission` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "admin",
DROP COLUMN "attendance",
DROP COLUMN "employee",
DROP COLUMN "permission";
