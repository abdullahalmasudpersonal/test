import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { Ifile } from "../../interfaces/file";
import { Specialties } from "@prisma/client";

const createSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file as Ifile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

const getAllSpecialtiesIntoDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

const deleteSpecialtiesIntoDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesServices = {
  createSpecialtiesIntoDB,
  getAllSpecialtiesIntoDB,
  deleteSpecialtiesIntoDB,
};
