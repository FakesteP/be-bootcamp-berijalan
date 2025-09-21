import { Router } from "express";
import {
  CGetCounter,
  CCreateCounter,
  CDeleteCounter,
  CGetAllCounters,
  CUpdateCounter,
  CUpdateCounterStatus,
} from "../controllers/counter.controller";
import {
  MCache,
  CachePresets,
  MInvalidateCache,
} from "../middlewares/cache.middleware";
import {
  MValidate,
  counterSchema,
  updateCounterSchema,
  updateCounterStatusSchema,
} from "../middlewares/validation.middleware";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

// Get all counters - no auth required
router.get("/", MCache(CachePresets.medium()), CGetAllCounters);

// Get counter by ID - no auth required
router.get("/:id", MCache(CachePresets.medium()), CGetCounter);

// Create counter - auth required
router.post(
  "/",
  MAuthValidate,
  MValidate(counterSchema),
  CCreateCounter,
  MInvalidateCache(["medium_cache:*"])
);

// Update counter - auth required
router.put(
  "/:id",
  MAuthValidate,
  MValidate(updateCounterSchema),
  CUpdateCounter,
  MInvalidateCache(["medium_cache:*"])
);

// Update counter status - auth required
router.put(
  "/:id/status",
  MAuthValidate,
  MValidate(updateCounterStatusSchema),
  CUpdateCounterStatus,
  MInvalidateCache(["medium_cache:*"])
);

// Delete counter - auth required
router.delete(
  "/:id",
  MAuthValidate,
  CDeleteCounter,
  MInvalidateCache(["medium_cache:*"])
);

export default router;
