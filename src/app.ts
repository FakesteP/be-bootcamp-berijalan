import express, { Router } from "express";
import cors from "cors";
import adminRouter from "./routes/auth.routes";
import counterRoutes from "./routes/counter.routes";
import queueRoutes from "./routes/queue.routes";
import { MErrorHandler } from "./middlewares/error.middleware";
import { connectRedis } from "./configs/redis.config";
import { CInitSSE } from "./controllers/sse.controller";

const app = express();
const router = Router();

connectRedis();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", adminRouter);
app.use("/api/v1/counters", counterRoutes);
app.use("/api/v1/queues", queueRoutes);
app.use("/api/v1/sse", router);
router.get("/", CInitSSE);
app.use(MErrorHandler);

app.listen(5000, () => {
  console.log("Server running in http://localhost:5000");
});
