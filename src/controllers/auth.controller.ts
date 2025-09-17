import { Request, Response, NextFunction } from "express";
import { SDelete, SGetAllAdmins, SLogin, SRegister, SUpdate } from "../services/auth.service";

export const CLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await SLogin(usernameOrEmail, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password, email, name } = req.body;
    const result = await SRegister(username, password, email, name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { username, password, email, name } = req.body;
    const result = await SUpdate(id, username, password, email, name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await SDelete(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// admin controller
export const CGetAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllAdmins();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};