import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import { DoctorScheduleServices } from "./doctorSchedule.services";
import pick from "../../../shared/pick";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleServices.createDoctorScheduleIntoDB(
      req.body,
      user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);

const getMyDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await DoctorScheduleServices.getMyDoctorScheduleFromDB(
      filters,
      options,
      user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get my doctor schedule successfully",
      data: result,
    });
  }
);

const deleteDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleServices.deleteDoctorScheduleFromDB(
      user as IAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Delete doctor schedule successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
  getMyDoctorSchedule,
  deleteDoctorSchedule,
};
