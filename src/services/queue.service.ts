import { PrismaClient } from "@prisma/client";
import { IGlobalResponse } from "../interfaces/global.interface";

const prismaClient = new PrismaClient();

export const SClaimQueue = async (): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findFirst({
      where: { isActive: true, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });

    if (!counter) {
      throw Error("No active counter found!");
    }

    let nextQueueNum = counter.currentQueue + 1;

    const queue = await prismaClient.queue.create({
      data: {
        status: "claimed",
        number: nextQueueNum,
        counterId: counter.id,
      },
      include: {
        counter: true,
      },
    });

    await prismaClient.counter.update({
      where: { id: counter.id },
      data: { currentQueue: { increment: 1 } },
    });

    return {
      status: true,
      message: "Success claim queue!",
      data: queue,
    };
  } catch (e) {
    throw e;
  }
};

export const SNextQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findUnique({
      where: { id: counterId, isActive: true, deletedAt: null },
    });

    if (!counter) {
      throw Error("No active counter found!");
    }

    const claimedQueue = await prismaClient.queue.findFirst({
      where: {
        counterId: counter.id,
        status: "claimed",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!claimedQueue) {
      throw Error("No claimed queue found!");
    }

    await prismaClient.queue.update({
      where: { id: claimedQueue.id },
      data: {
        status: "called",
      },
    });

    return {
      status: true,
      message: "Success get next queue!",
      data: {
        ...claimedQueue,
      },
    };
  } catch (e) {
    throw e;
  }
};

export const SResetQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    // Hapus semua queue pada counter ini
    await prismaClient.queue.deleteMany({
      where: { counterId },
    });

    // Reset currentQueue pada counter ke 0
    await prismaClient.counter.update({
      where: { id: counterId },
      data: { currentQueue: 0 },
    });

    return {
      status: true,
      message: "Queue berhasil direset!",
      data: null,
    };
  } catch (e) {
    throw e;
  }
};

export const SReleaseQueue = async (
  queueId: number
): Promise<IGlobalResponse> => {
  try {
    const queue = await prismaClient.queue.findUnique({
      where: { id: queueId },
    });

    if (!queue) {
      throw Error("Queue not found!");
    }

    if (queue.status !== "claimed") {
      throw Error("Queue is not in claimed status, cannot be released!");
    }

    const updatedQueue = await prismaClient.queue.update({
      where: { id: queueId },
      data: {
        status: "released",
      },
    });

    return {
      status: true,
      message: "Queue released successfully!",
      data: updatedQueue,
    };
  } catch (e) {
    throw e;
  }
};

export const SCurrentQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findUnique({
      where: { id: counterId, isActive: true, deletedAt: null },
    });

    if (!counter) {
      throw Error("Counter not found or inactive!");
    }

    const currentQueue = await prismaClient.queue.findFirst({
      where: {
        counterId: counter.id,
        OR: [{ status: "claimed" }, { status: "called" }],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!currentQueue) {
      return {
        status: false,
        message: "No current queue found!",
        data: null,
      };
    }

    return {
      status: true,
      message: "Current queue fetched successfully!",
      data: currentQueue,
    };
  } catch (e) {
    throw e;
  }
};

export const SSkipQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findUnique({
      where: { id: counterId, isActive: true, deletedAt: null },
    });

    if (!counter) {
      throw Error("No active counter found!");
    }

    const claimedQueue = await prismaClient.queue.findFirst({
      where: {
        counterId: counter.id,
        status: "claimed",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!claimedQueue) {
      throw Error("No claimed queue found to skip!");
    }

    // Update the current claimed queue to skipped status
    const skippedQueue = await prismaClient.queue.update({
      where: { id: claimedQueue.id },
      data: {
        status: "skipped",
      },
    });

    return {
      status: true,
      message: "Queue skipped successfully!",
      data: skippedQueue,
    };
  } catch (e) {
    throw e;
  }
};
