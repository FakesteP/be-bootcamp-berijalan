import { NextFunction, Request, Response } from "express";
import {
  SClaimQueue,
  SCurrentQueue,
  SNextQueue,
  SReleaseQueue,
  SResetQueue,
  SSkipQueue,
} from "../services/queue.service";

export const CClaimedQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SClaimQueue();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CNextQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const counterId = Number(req.params.counter_id);
    const result = await SNextQueue(counterId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CResetQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const counterId = Number(req.params.counter_id);
    const result = await SResetQueue(counterId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CReleaseQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const queueId = Number(req.params.queue_id);
    const result = await SReleaseQueue(queueId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCurrentQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const counterId = Number(req.params.counter_id);
    const result = await SCurrentQueue(counterId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CSkipQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const counterId = Number(req.params.counter_id);
    const result = await SSkipQueue(counterId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
