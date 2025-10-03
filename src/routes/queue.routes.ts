import { Router } from "express";
import {
  CClaimQueue,
  CReleaseQueue,
  CGetCurrentQueues,
  CNextQueue,
  CSkipQueue,
  CResetQueues,
  CGetMetrics,
  CSearchQueues,
  CServeQueue,
} from "../controllers/queue.controller";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/metrics", CGetMetrics);
router.post("/claim", CClaimQueue);
router.post("/release", CReleaseQueue);
router.get("/current", CGetCurrentQueues);
router.get("/search", CSearchQueues);
router.post("/serve", MAuthValidate, CServeQueue);
router.post("/next", MAuthValidate, CNextQueue);
router.post("/skip", MAuthValidate, CSkipQueue);
router.post("/reset", MAuthValidate, CResetQueues);

export default router;
