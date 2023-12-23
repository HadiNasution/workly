-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "office_radius" DECIMAL(65,30),
    "office_latitude" DECIMAL(65,30),
    "office_longitude" DECIMAL(65,30),
    "office_address" CHAR(255) NOT NULL,
    "office_name" CHAR(255) NOT NULL,
    "minute_late_limit" INTEGER DEFAULT 10,
    "wfh_limit" INTEGER DEFAULT 4,
    "leaves_limit" INTEGER DEFAULT 12,
    "enable_wfh" BOOLEAN NOT NULL DEFAULT true,
    "using_shot" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
