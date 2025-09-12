import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interfaces/global.interface";

export const MErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error" + err);

  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
    };
  
    const errorObject: any = {message: err.message};


  if (err.name) {
      errorObject.name = err.name;
    };

  if (isDevelopment && err.stack) {
      errorObject.detail = err.stack;
    }
    response.error = errorObject;

    res.status(400).json(response);
  } else {
    const response: IGlobalResponse = {
      status: false,
      message: "Terjadi error yang tidak terduga",
      error: {
        message: "Terjadi kesalahan pada server",
        ...(isDevelopment && { detail: err }),
      },
    };

    res.status(500).json(response);
  }
}  