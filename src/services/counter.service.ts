import { PrismaClient } from "@prisma/client/extension";
import { IGlobalResponse } from "../interfaces/global.interface";
import bcrypt from "bcrypt";
import { ICounterResponse } from "../interfaces/counter.interface";

const prismaClient = new PrismaClient();

export const SGetAllCounters = async (): Promise<
  IGlobalResponse<ICounterResponse[]>
> => {
  const counter = await prismaClient.counter.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      currentQueue: true,
      maxQueue: true,
      queues: true,
      isActive: true,
    },
  });

  return {
    status: true,
    message: "Get counters success",
    data: counter,
  };
};

export const SGetCounter = async (
  id: number
): Promise<IGlobalResponse<ICounterResponse>> => {
  const counter = await prismaClient.counter.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      currentQueue: true,
      maxQueue: true,
      queues: true,
      isActive: true,
    },
  });

  if (!counter) {
    throw new Error("Counter not found");
  }

  return {
    status: true,
    message: "Get counter success",
    data: counter,
  };
};

export const SCreateCounter = async (
  name: string,
  maxQueue: number
): Promise<IGlobalResponse<ICounterResponse>> => {
  try {
    const counter = await prismaClient.counter.create({
      data: {
        name,
        currentQueue: 0,
        maxQueue,
        queues: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      status: true,
      message: "Berhasil membuat counter!",
      data: counter,
    };
  } catch (e) {
    throw e;
  }
};

export const SUpdateCounter = async (
  id: number,
  name: string,
  maxQueue: number,
  isActive: boolean
): Promise<IGlobalResponse<ICounterResponse>> => {
  try {
    const counter = await prismaClient.counter.update({
      where: { id },
      data: {
        name,
        maxQueue,
        isActive,
        updatedAt: new Date(),
      },
    });
    return {
      status: true,
      message: "Berhasil memperbarui counter!",
      data: counter,
    };
  } catch (e) {
    throw e;
  }
};

export const SDeleteCounter = async (id: number): Promise<IGlobalResponse> => {
  try {
    await prismaClient.counter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      status: true,
      message: "Berhasil menghapus counter!",
    };
  } catch (e) {
    throw e;
  }
};

export const SUpdateCounterStatus = async (
  id: number,
  status: "active" | "inactive" | "disable"
): Promise<IGlobalResponse<ICounterResponse>> => {
  try {
    let updateData: any = {};

    if (status === "active") {
      updateData.isActive = true;
      updateData.deletedAt = null;
    } else if (status === "inactive") {
      updateData.isActive = false;
      updateData.deletedAt = null;
    } else if (status === "disable") {
      updateData.isActive = false;
      updateData.deletedAt = new Date();
    }

    const counter = await prismaClient.counter.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return {
      status: true,
      message: `Counter status berhasil diubah ke ${status}!`,
      data: counter,
    };
  } catch (e) {
    throw e;
  }
};
