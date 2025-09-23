import { Request, Response, NextFunction } from "express";
import {
  SGetCounter,
  SCreateCounter,
  SDeleteCounter,
  SGetAllCounters,
  SUpdateCounter,
  SUpdateCounterStatus,
} from "../services/counter.service";

// Get counter by ID
export const CGetCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await SGetCounter(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Create counter
export const CCreateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, maxQueue } = req.body;
    const result = await SCreateCounter(name, maxQueue);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete counter
export const CDeleteCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await SDeleteCounter(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get all counters
export const CGetAllCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllCounters();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Update counter
export const CUpdateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, maxQueue, isActive } = req.body;
    const result = await SUpdateCounter(id, name, maxQueue, isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Update counter status
export const CUpdateCounterStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // status: "active" | "inactive" | "disable"
    const result = await SUpdateCounterStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
