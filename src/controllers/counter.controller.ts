import { Request, Response, NextFunction } from "express";
import {
  SGetAllCounters,
  SGetCounterById,
  SCreateCounter,
  SUpdateCounter,
  SDeleteCounter,
  SToggleCounterStatus,
} from "../services/counter.service";

export const CGetAllCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllCounters(req.query.include_inactive === "true");

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetCounterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const result = await SGetCounterById(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCreateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, maxQueue, isActive } = req.body;
    const result = await SCreateCounter(name, maxQueue, isActive);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, maxQueue, isActive } = req.body;

    const result = await SUpdateCounter(id, name, maxQueue, isActive);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CDeleteCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const result = await SDeleteCounter(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CToggleCounterStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const result = await SToggleCounterStatus(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
