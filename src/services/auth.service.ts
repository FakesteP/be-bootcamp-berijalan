import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { IDeleteResponse, IGlobalResponse, IUpdateResponse } from "../interfaces/global.interface";
import { ILoginResponse } from "../interfaces/global.interface";
import { UGenerateToken } from "../utils/UGenerateToken";

const prisma = new PrismaClient();

export const SLogin = async (
  usernameOrEmail: string,
  password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!admin) {
    throw Error("username/email salah");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw Error("password salah");
  }

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Login berhasil",
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const SRegister = async (
  username: string,
  password: string,
  email: string,
  name: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
      email,
      name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Berhasil menambahkan admin",
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const SUpdate = async (
  id: number,
  username: string,
  password: string,
  email: string,
  name: string
): Promise<IGlobalResponse<IUpdateResponse>> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.update({
    where: { id },
    data: {
      username,
      password: hashedPassword,
      email,
      name,
      updatedAt: new Date(),
    },
  });
  return {
    status: true,
    message: "Berhasil memperbarui admin",
    data: {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const SDelete = async (
  id: number
): Promise<IGlobalResponse<IDeleteResponse>> => {
  const admin = await prisma.admin.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedAt: new Date(),
    }, 
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      deletedAt: true,
    } 
  });

  return { 
    status: true,
    message: "Berhail menghapus admin",
    data: admin,
  };
}