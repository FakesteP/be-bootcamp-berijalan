import { Router } from "express";
import {
  CDelete,
  CGetAdminByID,
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
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

// Get all admins - auth required
router.get(
  "/admin",
  MAuthValidate,
  MCache(CachePresets.medium()),
  CGetAllAdmins
);

// Get admin by ID - auth required
router.get(
  "/admin/:id",
  MAuthValidate,
  MCache(CachePresets.medium()),
  CGetAdminByID
);

// Login - no auth required
router.post("/login", MValidate(loginSchema), CLogin);

// Create admin - auth required
router.post(
  "/create",
  MAuthValidate,
  MValidate(newAdminSchema),
  CRegister,
  MInvalidateCache(["medium_cache:*"])
);

// Update admin - auth required
router.put(
  "/:id",
  MAuthValidate,
  MValidate(updateAdminSchema),
  CUpdate,
  MInvalidateCache(["medium_cache:*"])
);

// Delete admin - auth required
router.delete(
  "/:id",
  MAuthValidate,
  CDelete,
  MInvalidateCache(["medium_cache:*"])
);

export default router;
