import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentServices } from "./payment.services";
import httpStatus from "http-status";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const {appointmentId} = req.params;
  const result = await PaymentServices.initPaymentIntoDB(appointmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
};
