import { Admin } from "@prisma/client";
import jwt from "jsonwebtoken";
import ms from "ms";
import { redisClient } from "../configs/redis.config";

const JWT_SECRET = process.env.JWT_SECRET || "pokoknya_aman";
const JWT_EXPIRED_IN = (process.env.JWT_EXPIRED_IN || "1m") as ms.StringValue;

export const UGenerateToken = (admin: Admin) => {
  const token = jwt.sign(admin, JWT_SECRET, {
    expiresIn: JWT_EXPIRED_IN,
  });
  const key = `token:${token.split(".")[2]}:${admin.id}`;

  redisClient.set(key, token, {
    expiration: {
      type: "EX",
      value: ms(JWT_EXPIRED_IN) / 1000,
    },
  });

  return token;
};

export const UVerifyToken = async (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as Admin;

  if (!payload || !payload.id) {
    throw new Error("Unauthorized");
  }

  const key = `token:${token.split(".")[2]}:${payload.id}`;
  const data = await redisClient.get(key);
  if (!data || data !== token) {
    throw new Error("Unauthorized");
  }
  return payload;
};

export const UInvalidateToken = async (
  adminId: number,
  token: string
): Promise<void> => {
  try {
    const key = `token:${token.split(".")[2]}:${adminId}`;
    await redisClient.del(key);
    return;
  } catch (error) {
    return;
  }
};
