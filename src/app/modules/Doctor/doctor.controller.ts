import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorService.getAllDoctorIntoDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieval successfully",
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getSingleDoctorIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Doctor retrieval successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateDoctorIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctorIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDeleteDoctorIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctor,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  softDeleteDoctor,
};
