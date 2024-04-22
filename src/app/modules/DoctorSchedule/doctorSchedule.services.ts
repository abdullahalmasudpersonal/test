import { DoctorSchedule, Prisma, Schedule } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAuthUser, IGenericResponse } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createDoctorScheduleIntoDB = async (
  payload: {
    scheduleIds: string[];
  },
  user: any
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedulesData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  console.log(doctorSchedulesData);

  const result = await prisma.doctorSchedule.createMany({
    data: doctorSchedulesData,
  });
  return result;
};

const getMyDoctorScheduleFromDB = async (
  filters: any,
  options: IPaginationOptions,
  user: any
): Promise<IGenericResponse<DoctorSchedule[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    doctor: {
      email: user.email,
    },
    ...(startDate && endDate
      ? {
          schedule: {
            startDate: {
              gte: new Date(startDate),
            },
            endDate: {
              lte: new Date(endDate),
            },
          },
        }
      : {}),
    ...(Object.keys(filterData).length > 0
      ? {
          AND: Object.keys(filterData).map((key) => ({
            [key]: {
              equals: (filterData as any)[key],
            },
          })),
        }
      : {}),
  };

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    // include: {
    //   //  doctor: true,
    //   schedule: true,
    //   //appointment: true,
    // },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    meta: {
      total: doctorSchedules.length,
      page,
      limit,
    },
    data: doctorSchedules,
  };
};

const deleteDoctorScheduleFromDB = async (
  user: any,
  scheduleId: string
): Promise<DoctorSchedule> => {
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exitsts");
  }

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: isDoctorExists.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This schedule is alrady booked!!"
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: isDoctorExists.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

export const DoctorScheduleServices = {
  createDoctorScheduleIntoDB,
  getMyDoctorScheduleFromDB,
  deleteDoctorScheduleFromDB,
};
