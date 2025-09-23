import {NextFunction, Request, Response} from "express";
import { UVerifyToken } from "../utils/jwt.util";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MAuthValidate = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const token = auth.split(" ")[1];
    
    const payload = await UVerifyToken(token);

    const user = await prisma.admin.findUnique({
      where: { id: payload.id, deletedAt: null, isActive: true },
    });

    if (!user) {
      throw Error("Unauthorized");
    }

    req.user = payload;
    
    next();
  } catch (e) {
    next(e);
  }
}