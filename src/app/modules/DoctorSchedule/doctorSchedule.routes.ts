import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMyDoctorSchedule
);
router.post(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteDoctorSchedule
);

export const DoctorScheduleRouters = router;
