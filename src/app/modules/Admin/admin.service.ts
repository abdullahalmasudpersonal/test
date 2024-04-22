import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllAdminFromDB = async (
  parms: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = parms;
  const andCondition: Prisma.AdminWhereInput[] = [];

  // console.log(filterData);

  if (parms.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: parms.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    mata: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
  ///
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateSingleAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  console.log("updated");

  return result;
};

const deleteSingleAdminIntoDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClent) => {
    const adminDeletedData = await transactionClent.admin.delete({
      where: {
        id,
      },
    });
    await transactionClent.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });
  return result;
};

const softDeleteSingleAdminIntoDB = async (
  id: string
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClent) => {
    const adminDeletedData = await transactionClent.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClent.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateSingleAdminIntoDB,
  deleteSingleAdminIntoDB,
  softDeleteSingleAdminIntoDB,
};
