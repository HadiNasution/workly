/*
  Warnings:

  - Made the column `type` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "type" SET NOT NULL;
