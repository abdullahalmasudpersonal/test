import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await AdminService.getAllAdminFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched!",
    meta: result.mata,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getSingleAdminFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single Admin data fetched!",
    data: result,
  });
});

const updateSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.updateSingleAdminIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Admin data Updated!",
    data: result,
  });
});

const deleteSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteSingleAdminIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Admin deleted!",
    data: result,
  });
});

const softDeleteSingleAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.softDeleteSingleAdminIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Soft Single Admin deleted!",
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  softDeleteSingleAdmin,
};
