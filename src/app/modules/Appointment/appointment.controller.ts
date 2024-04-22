import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentServices } from "./appointment.services";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { appointmentFilterableFields } from "./appointment.constants";

const getAllAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AppointmentServices.getAllAppointmentFromDB(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AppointmentServices.getMyAppointmentIntoDB(
      user as IAuthUser,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get my appointment successfully",
      data: result,
    });
  }
);

const creaeAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.creaeAppointmentIntoDB(
      req.body,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Create appointment successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  getAllAppointment,
  creaeAppointment,
  getMyAppointment,
};
