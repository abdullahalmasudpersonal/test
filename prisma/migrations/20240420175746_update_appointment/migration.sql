/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `doctorSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctorSchedule_appointmentId_key" ON "doctorSchedule"("appointmentId");

-- AddForeignKey
ALTER TABLE "doctorSchedule" ADD CONSTRAINT "doctorSchedule_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
