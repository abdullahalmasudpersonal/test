import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesServices } from "./specialties.services";
import { Request, Response } from "express";

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await SpecialtiesServices.createSpecialtiesIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Create specialties successfully",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getAllSpecialtiesIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteSingleSpecialties = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesServices.deleteSpecialtiesIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  }
);

export const SpecialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteSingleSpecialties,
};
