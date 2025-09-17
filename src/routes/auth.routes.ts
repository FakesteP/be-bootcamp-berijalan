import { Router } from "express";
import {
  CDelete,
  CGetAllAdmins,
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
import {
  CachePresets,
  MCache,
  MInvalidateCache,
} from "../middlewares/cache.middleware";

const router = Router();

router.get("/admin", MCache(CachePresets.medium()), CGetAllAdmins);

router.post("/login", MValidate(loginSchema), CLogin); // validasi login

router.post(
  "/create",
  MValidate(newAdminSchema),
  CRegister,
  MInvalidateCache(["medium_cache:*"])
);

router.put(
  "/:id",
  MValidate(updateAdminSchema),
  CUpdate,
  MInvalidateCache(["medium_cache:*"])
);

router.delete("/:id", CDelete, MInvalidateCache(["medium_cache:*"]));

export default router;
