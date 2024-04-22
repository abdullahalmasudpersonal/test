import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { IAuthUser, IGenericResponse } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Appointment, Prisma, UserRole } from "@prisma/client";
import {
  appointmentRelationalFields,
  appointmentRelationalFieldsMapper,
} from "./appointment.constants";

const getMyAppointmentIntoDB = async (
  user: IAuthUser,
  filters: any,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAllAppointmentFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Appointment[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  // if (searchTerm) {
  //     andConditions.push({
  //         OR: appointmentSearchableFields.map(field => ({
  //             [field]: {
  //                 contains: searchTerm,
  //                 mode: 'insensitive',
  //             },
  //         })),
  //     });
  // }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (appointmentRelationalFields.includes(key)) {
          return {
            [appointmentRelationalFieldsMapper[key]]: {
              email: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  // console.dir(andConditions, { depth: Infinity })
  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const creaeAppointmentIntoDB = async (payload: any, user: any) => {
  const today = new Date();
  const transactionId: string =
    "PH-HealthCare-" +
    today.getFullYear() +
    "-" +
    today.getMonth() +
    "-" +
    today.getDay() +
    "-" +
    today.getHours() +
    "-" +
    today.getMinutes();

  console.log(today, transactionId);

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appoinemtData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appoinemtData.id,
      },
    });

    const today = new Date();
    const transactionId: string =
      "PH-HealthCare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes();
    console.log(transactionId);

    await tx.payment.create({
      data: {
        appointmentId: appoinemtData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appoinemtData;
  });

  return result;
};

export const AppointmentServices = {
  creaeAppointmentIntoDB,
  getMyAppointmentIntoDB,
  getAllAppointmentFromDB,
};
