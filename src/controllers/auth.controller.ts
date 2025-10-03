import { Request, Response, NextFunction } from "express";
import { SDelete, SGetAdminById, SGetAllAdmins, SLogin, SLogout, SRegister, SToggleAdminStatus, SUpdate } from "../services/auth.service";

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

export const CGetAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await SGetAdminById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CToggleAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const result = await SToggleAdminStatus(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Ambil token dari header (middleware MAuthValidate sudah verify token)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        status: false,
        message: "Token tidak ditemukan",
        data: null,
      });
      return;
    }

    const result = await SLogout(token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};