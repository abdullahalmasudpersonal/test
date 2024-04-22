import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment/:appointmentId", PaymentController.initPayment);

export const PaymentRoutes = router;
