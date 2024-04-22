import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ScheduleServices } from "./schedule.service";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./schedule.constants";
import { IAuthUser } from "../../interfaces/common";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.createScheduleIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await ScheduleServices.getAllScheduleFromDB(
      filters,
      options,
      user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all schedule successfully",
      data: result,
    });
  }
);

const getSingleSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.getSingleScheduleIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single schedule successfully",
    data: result,
  });
});

const deleteSingleSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.deleteSingleScheduleFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Schedule deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedule,
  getSingleSchedule,
  deleteSingleSchedule,
};
