import { Router } from "express";
import {
  CCreateCounter,
  CDeleteCounter,
  CGetAllCounters,
  CUpdateCounter,
  CGetCounterById,
  CToggleCounterStatus,
} from "../controllers/counter.controller";
import { MCache, CachePresets } from "../middlewares/cache.middleware";
import {
  MValidate,
  counterSchema,
  updateCounterSchema,
  updateCounterStatusSchema,
} from "../middlewares/validation.middleware";
import { MAuthValidate } from "../middlewares/auth.middleware";
import { count } from "console";

const router = Router();

router.get("/", CGetAllCounters);
router.get("/:id", CGetCounterById);
router.post("/", MAuthValidate, MValidate(counterSchema), CCreateCounter);

router.put(
  "/:id",
  MAuthValidate,
  MValidate(updateCounterSchema),
  CUpdateCounter
);

router.put(
  "/:id/status",
  MAuthValidate,
  MValidate(updateCounterStatusSchema),
  CToggleCounterStatus
);

router.delete("/:id", MAuthValidate, CDeleteCounter);

export default router;
