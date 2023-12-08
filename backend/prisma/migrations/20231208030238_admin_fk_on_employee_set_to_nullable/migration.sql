-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_admin_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
