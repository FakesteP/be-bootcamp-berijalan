import { Router } from "express";
import {
  CDelete,
  CGetAdminByID,
  CGetAllAdmins,
  CLogin,
  CLogout,
  CRegister,
  CToggleAdminStatus,
  CUpdate,
} from "../controllers/auth.controller";
import {
  MValidate,
  newAdminSchema,
  loginSchema,
  updateAdminSchema,
  updateCounterStatusSchema,
} from "../middlewares/validation.middleware";
import {
  CachePresets,
  MCache,
  MInvalidateCache,
} from "../middlewares/cache.middleware";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

// Get all admins - auth required
router.get("/admins", CGetAllAdmins);

// Get admin by ID - auth required
router.get(
  "/admin/:id",
  MAuthValidate,
  MCache(CachePresets.medium()),
  CGetAdminByID
);

// Login - no auth required
router.post("/login", MValidate(loginSchema), CLogin);

// Logout - auth required
router.post("/logout", MAuthValidate, CLogout);

// Create admin
router.post(
  "/create",
  MAuthValidate,
  MValidate(newAdminSchema),
  MInvalidateCache(["medium_cache:*"]),
  CRegister
);

// Update admin - auth required
router.put(
  "/:id",
  MAuthValidate,
  MValidate(updateAdminSchema),
  MInvalidateCache(["medium_cache:*"]),
  CUpdate
);

// Delete admin - auth required
router.delete(
  "/:id",
  MAuthValidate,
  MInvalidateCache(["medium_cache:*"]),
  CDelete
);


router.put(
  "/:id/toggle-status",
  MAuthValidate,
  MValidate(updateCounterStatusSchema),
  CToggleAdminStatus,
  MInvalidateCache(["medium_cache:*", "user_cache:*"])
);

export default router;
