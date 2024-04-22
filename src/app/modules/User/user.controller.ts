import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdminIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctorIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatientIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query);
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await UserService.getAllUserFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.mata,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.changeProfileStatusIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Profile status changed successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const result = await UserService.getMyProfileIntoDB(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    console.log(user);
    const result = await UserService.updateMyProfileIntoDB(
      user as IAuthUser,
      req
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
