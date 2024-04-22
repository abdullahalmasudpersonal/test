import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = express.Router();

// task 3
router.get("/", DoctorController.getAllDoctor);

//task 4
router.get("/:id", DoctorController.getSingleDoctor);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidation.update),
  DoctorController.updateDoctor
);

//task 5
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteDoctor
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.softDeleteDoctor
);

export const DoctorRoutes = router;
