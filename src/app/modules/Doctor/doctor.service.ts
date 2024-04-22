import { Doctor, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest } from "./doctor.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctorIntoDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // doctor > doctorSpecialties > specialties -> title

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
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

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

  /*   const result = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
  }); */
};

const getSingleDoctorIntoDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClent) => {
    await transactionClent.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      /// delete specielties
      specialties.filter(
        (specialty: { isDeleted: any }) => specialty.isDeleted
      );
      for (const speciality of specialties) {
        await transactionClent.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialtiesId,
          },
        });
      }
    }

    ///create specialties
    const createSpecialtiesIds = specialties.filter(
      (specialty: { isDeleted: any }) => !specialty.isDeleted
    );
    for (const speciality of createSpecialtiesIds) {
      await transactionClent.doctorSpecialties.create({
        data: {
          doctorId: doctorInfo.id,
          specialitiesId: speciality.specialtiesId,
        },
      });
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const deleteDoctorIntoDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDeleteDoctorIntoDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  getAllDoctorIntoDB,
  getSingleDoctorIntoDB,
  updateDoctorIntoDB,
  deleteDoctorIntoDB,
  softDeleteDoctorIntoDB,
};
