import { PrismaClient } from "@prisma/client";
import { publishQueueUpdate } from "../configs/redis.config";
import { IGlobalResponse } from "../interfaces/global.interface";

const prisma = new PrismaClient();

export const SGetMetrics = async (): Promise<IGlobalResponse> => {
  const waitingCount = await prisma.queue.count({
    where: { status: "CLAIMED" },
  });
  const calledCount = await prisma.queue.count({ where: { status: "CALLED" } });
  const releasedCount = await prisma.queue.count({
    where: { status: "RELEASED" },
  });
  const skippedCount = await prisma.queue.count({
    where: { status: "SKIPPED" },
  });

  return {
    status: true,
    message: "Metrics retrieved successfully",
    data: {
      waiting: waitingCount,
      called: calledCount,
      released: releasedCount,
      skipped: skippedCount,
    },
  };
};

export const SClaimQueue = async (): Promise<IGlobalResponse> => {
  const counter = await prisma.counter.findFirst({
    where: { isActive: true, deletedAt: null },
    orderBy: { currentQueue: "asc" },
  });
  if (!counter) throw new Error("No active counters found");

  let nextQueueNumber = counter.currentQueue + 1;
  if (nextQueueNumber > counter.maxQueue) nextQueueNumber = 1;

  const queue = await prisma.queue.create({
    data: { number: nextQueueNumber, status: "CLAIMED", counterId: counter.id },
    include: { counter: true },
  });

  await prisma.counter.update({
    where: { id: counter.id },
    data: { currentQueue: nextQueueNumber },
  });

  await publishQueueUpdate({
    event: "queue_claimed",
    counter_id: counter.id,
    counter_name: counter.name,
    queue_number: nextQueueNumber,
  });

  const calledQueuePosition = await prisma.queue.count({
    where: {
      counterId: counter.id,
      status: "CALLED",
      createdAt: { lt: queue.createdAt },
    },
  });
  const waitingQueueCount = await prisma.queue.count({
    where: {
      counterId: counter.id,
      status: "CLAIMED",
      createdAt: { lt: queue.createdAt },
    },
  });

  const estimatedWaitTime = (calledQueuePosition + waitingQueueCount) * 5; // menit

  return {
    status: true,
    message: "Queue claimed successfully",
    data: {
      queueNumber: queue.number,
      counterName: queue.counter.name,
      counterId: queue.counter.id,
      estimatedWaitTime,
      positionInQueue: waitingQueueCount + 1,
    },
  };
};

export const SReleaseQueue = async (
  queueNumber: number,
  counterId: number
): Promise<IGlobalResponse> => {
  if (!queueNumber || queueNumber <= 0) throw new Error("Invalid queue number");
  if (!counterId || counterId <= 0) throw new Error("Invalid counter ID");

  const counter = await prisma.counter.findUnique({
    where: { id: counterId, deletedAt: null },
  });
  if (!counter) throw new Error("Counter not found");
  if (!counter.isActive) throw new Error("Counter is not active");

  const queue = await prisma.queue.findFirst({
    where: { number: queueNumber, counterId, status: "CLAIMED" },
  });
  if (!queue) throw new Error("Queue not found or already processed");

  await prisma.queue.update({
    where: { id: queue.id },
    data: { status: "RELEASED" },
  });

  await publishQueueUpdate({
    event: "queue_released",
    counter_id: counterId,
    queue_number: queueNumber,
  });

  return { status: true, message: "Queue released successfully" };
};

export const SGetCurrentQueues = async (
  includeInactive = false
): Promise<IGlobalResponse> => {
  const whereCondition: any = { deletedAt: null };
  if (!includeInactive) whereCondition.isActive = true;

  const counters = await prisma.counter.findMany({
    where: whereCondition,
    orderBy: { name: "asc" },
  });

  const currentQueues = await prisma.queue.findMany({
    where: {
      counterId: { in: counters.map((c) => c.id) },
      status: { in: ["CALLED", "SERVED", "SKIPPED"] },
      counter: {
        isActive: includeInactive ? undefined : true,
        deletedAt: null,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = counters.map((counter) => {
    const currentQueue = currentQueues.find((q) => q.counterId === counter.id);
    return {
      id: counter.id,
      isActive: counter.isActive,
      name: counter.name,
      currentQueue: currentQueue?.number,
      maxQueue: counter.maxQueue,
      status: currentQueue?.status || null,
    };
  });

  return {
    status: true,
    message: "Current queues retrieved successfully",
    data,
  };
};

export const SNextQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  if (!counterId || counterId <= 0) throw new Error("Invalid counter ID");

  const counter = await prisma.counter.findUnique({
    where: { id: counterId, deletedAt: null },
  });
  if (!counter) throw new Error("Counter not found");
  if (!counter.isActive) throw new Error("Counter is not active");

  const claimedQueue = await prisma.queue.findFirst({
    where: { counterId, status: "CLAIMED" },
    orderBy: { createdAt: "asc" },
  });
  if (!claimedQueue)
    throw new Error("No claimed queues found for this counter");

  await prisma.queue.update({
    where: { id: claimedQueue.id },
    data: { status: "CALLED" },
  });

  await publishQueueUpdate({
    event: "queue_called",
    counter_id: counterId,
    queue_number: claimedQueue.number,
    counter_name: counter.name,
  });

  return {
    status: true,
    message: "Next queue called successfully",
    data: {
      queueNumber: claimedQueue.number,
      counterName: counter.name,
      counterId,
    },
  };
};

export const SSkipQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  if (!counterId || counterId <= 0) throw new Error("Invalid counter ID");

  const counter = await prisma.counter.findUnique({
    where: { id: counterId, deletedAt: null },
  });
  if (!counter) throw new Error("Counter not found");
  if (!counter.isActive) throw new Error("Counter is not active");

  const calledQueue = await prisma.queue.findFirst({
    where: { counterId, status: "CALLED" },
    orderBy: { createdAt: "asc" },
  });
  if (!calledQueue) throw new Error("No called queue found for this counter");

  await prisma.queue.update({
    where: { id: calledQueue.id },
    data: { status: "SKIPPED" },
  });

  await publishQueueUpdate({
    event: "queue_skipped",
    counter_id: counterId,
    queue_number: calledQueue.number,
  });

  try {
    const nextQueueResult = await SNextQueue(counterId);
    return {
      status: true,
      message: "Queue skipped successfully and next queue called",
      data: nextQueueResult.data,
    };
  } catch {
    return {
      status: true,
      message: "Queue skipped successfully, no more queues to call",
    };
  }
};

export const SResetQueues = async (
  counterId?: number
): Promise<IGlobalResponse> => {
  if (counterId) {
    if (counterId <= 0) throw new Error("Invalid counter ID");

    const counter = await prisma.counter.findUnique({
      where: { id: counterId, deletedAt: null },
    });
    if (!counter) throw new Error("Counter not found");
    if (!counter.isActive) throw new Error("Counter is not active");

    await prisma.queue.updateMany({
      where: { counterId, status: { in: ["CLAIMED", "CALLED"] } },
      data: { status: "RESET" },
    });
    await prisma.counter.update({
      where: { id: counterId },
      data: { currentQueue: 0 },
    });

    await publishQueueUpdate({ event: "queue_reset", counter_id: counterId });
    return {
      status: true,
      message: `Queue for counter ${counter.name} reset successfully`,
    };
  }

  await prisma.queue.updateMany({
    where: {
      status: { in: ["CLAIMED", "CALLED"] },
      counter: { isActive: true, deletedAt: null },
    },
    data: { status: "RESET" },
  });
  await prisma.counter.updateMany({
    where: { isActive: true, deletedAt: null },
    data: { currentQueue: 0 },
  });
  await publishQueueUpdate({ event: "all_queues_reset" });

  return { status: true, message: "All active queues reset successfully" };
};

export const SSearchQueues = async (
  search?: string | null
): Promise<IGlobalResponse> => {
  const queues = await prisma.queue.findMany({
    where: {
      OR: [
        { number: isNaN(Number(search)) ? undefined : Number(search) },
        {
          counter: {
            name: { contains: search || undefined, mode: "insensitive" },
            deletedAt: null,
          },
        },
      ],
      counter: { isActive: true, deletedAt: null },
    },
    include: { counter: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const data = queues.map((queue) => ({
    id: queue.id,
    queueNumber: queue.number,
    status: queue.status,
    counter: { id: queue.counterId, name: queue.counter.name },
    createdAt: queue.createdAt,
    updatedAt: queue.updatedAt,
  }));

  return { status: true, message: "Queues retrieved successfully", data };
};

export const SServeQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  if (!counterId || counterId <= 0) throw new Error("Invalid counter ID");

  const counter = await prisma.counter.findUnique({
    where: { id: counterId, deletedAt: null },
  });
  if (!counter) throw new Error("Counter not found");
  if (!counter.isActive) throw new Error("Counter is not active");

  // cari antrian yang statusnya CALLED (lagi dipanggil)
  const calledQueue = await prisma.queue.findFirst({
    where: { counterId, status: "CALLED" },
    orderBy: { createdAt: "asc" },
  });
  if (!calledQueue)
    throw new Error("No called queue found for this counter");

  // update jadi SERVED
  await prisma.queue.update({
    where: { id: calledQueue.id },
    data: { status: "SERVED" },
  });

  await publishQueueUpdate({
    event: "queue_served",
    counter_id: counterId,
    queue_number: calledQueue.number,
    counter_name: counter.name,
  });

  return {
    status: true,
    message: "Queue served successfully",
    data: {
      queueNumber: calledQueue.number,
      counterName: counter.name,
      counterId,
    },
  };
};
