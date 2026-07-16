-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Agendado',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);
