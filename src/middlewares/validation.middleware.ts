import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const MValidate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => {
        return Error(detail.message);
      });
      [0];

      return next(new Error(validationErrors.join(", ")));
    }
    next();
  };
};

export const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required().messages({
    "string.empty": "Username atau email wajib diisi",
    "any.required": "Username atau email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password wajib diisi",
    "any.required": "Password wajib diisi",
  }),
});

export const newAdminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(100).trim().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password harus mengandung huruf besar, angka, dan simbol",
    }),
  email: Joi.string()
    .email()
    .pattern(new RegExp("@gmail\\.com$"))
    .required()
    .messages({
      "string.pattern.base": "Email harus menggunakan domain @gmail.com",
    }),
  name: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp("^[A-Za-z ]+$"))
    .trim()
    .required()
    .messages({
      "string.pattern.base": "Nama hanya boleh berisi huruf dan spasi",
    }),
});

export const updateAdminSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(100).trim().optional(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .optional()
    .messages({
      "string.pattern.base":
        "Password harus mengandung huruf besar, angka, dan simbol",
    }),
  email: Joi.string()
    .email()
    .pattern(new RegExp("@gmail\\.com$"))
    .optional()
    .messages({
      "string.pattern.base": "Email harus menggunakan domain @gmail.com",
    }),
  name: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp("^[A-Za-z ]+$"))
    .trim()
    .optional()
    .messages({
      "string.pattern.base": "Nama hanya boleh berisi huruf dan spasi",
    }),
});

export const counterSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().required(),
  maxQueue: Joi.number().min(1).required(),
});

export const updateCounterSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().optional(),
  maxQueue: Joi.number().min(1).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateCounterStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive", "disable").required(),
});
