import express from "express";
import {
  CClaimedQueue,
  CReleaseQueue,
  CCurrentQueue,
  CNextQueue,
  CSkipQueue,
  CResetQueue,
  CGetAllQueues,
} from "../controllers/queue.controller";
import { MAuthValidate } from "../middlewares/auth.middleware";
import {
  MCache,
  MInvalidateCache,
  CachePresets,
} from "../middlewares/cache.middleware";

const router = express.Router();

// === NO AUTH ===
router.post("/claim", MInvalidateCache(["short_cache:*"]), CClaimedQueue);

router.put(
  "/release/:queue_id",
  MInvalidateCache(["short_cache:*"]),
  CReleaseQueue
);

router.get("/current/:counter_id", MCache(CachePresets.short()), CCurrentQueue);

// === REQUIRE AUTH ===
router.put(
  "/next/:counter_id",
  MAuthValidate,
  MInvalidateCache(["short_cache:*"]),
  CNextQueue
);

router.put(
  "/skip/:counter_id",
  MAuthValidate,
  MInvalidateCache(["short_cache:*"]),
  CSkipQueue
);

router.delete(
  "/reset/:counter_id",
  MAuthValidate,
  MInvalidateCache(["short_cache:*"]),
  CResetQueue
);

// Misalnya, ini adalah rute publik untuk melihat semua antrean
router.get("/", CGetAllQueues);

export default router;
