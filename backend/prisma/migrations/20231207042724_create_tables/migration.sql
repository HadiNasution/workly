-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nip" VARCHAR(16) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100),
    "token_expires_at" TIMESTAMP(3),
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nip" VARCHAR(16) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" VARCHAR(12),
    "departmen" VARCHAR(100),
    "picture" VARCHAR(255),
    "token" VARCHAR(100),
    "token_expires_at" TIMESTAMP(3),
    "join_date" TIMESTAMP(3),
    "quit_date" TIMESTAMP(3),
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time_in" TIMESTAMP(3),
    "time_out" TIMESTAMP(3),
    "is_working" BOOLEAN DEFAULT false,
    "is_wfh" BOOLEAN DEFAULT false,
    "is_sick" BOOLEAN DEFAULT false,
    "is_leaves" BOOLEAN DEFAULT false,
    "is_permits" BOOLEAN DEFAULT false,
    "notes" VARCHAR(255),
    "longtitude_in" INTEGER NOT NULL,
    "latitude_in" INTEGER NOT NULL,
    "lontitude_out" INTEGER NOT NULL,
    "latitude_out" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecap" (
    "id" SERIAL NOT NULL,
    "count_sick" INTEGER,
    "count_permits" INTEGER,
    "count_leaves" INTEGER,
    "count_wfh" INTEGER,
    "count_works" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" VARCHAR(255),
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "AttendanceRecap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "admin_id" INTEGER,
    "attendance_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "message" VARCHAR(255),
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nip_key" ON "Admin"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_token_key" ON "Admin"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_nip_key" ON "Employee"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_token_key" ON "Employee"("token");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecap" ADD CONSTRAINT "AttendanceRecap_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
