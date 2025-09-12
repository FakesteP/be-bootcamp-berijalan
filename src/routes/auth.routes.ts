import { Router } from "express";
import {
  CDelete,
  CLogin,
  CRegister,
  CUpdate,
} from "../controllers/auth.controller";
import {
  MValidate,
  newAdminSchema,
  loginSchema,
  updateAdminSchema,
} from "../middlewares/validation.middleware";

const router = Router();

router.post("/login", MValidate(loginSchema), CLogin); // validasi login
router.post("/create", MValidate(newAdminSchema), CRegister); // validasi create
router.put("/:id", MValidate(updateAdminSchema), CUpdate); // validasi update
router.delete("/:id", CDelete);

export default router;
