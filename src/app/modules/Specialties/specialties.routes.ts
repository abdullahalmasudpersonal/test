import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidation } from "./specialities.validation";

const router = express.Router();

router.get("/", SpecialtiesController.getAllSpecialties);

router.post(
  "/",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSpecialtiesValidation.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesController.createSpecialties(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteSingleSpecialties
);

export const SpecialtiesRouters = router;
