import express from 'express';
import cors from 'cors';
import adminRouter from './routes/auth.routes';
import { MErrorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", adminRouter);

app.use(MErrorHandler);

app.listen(3000, () => {
  console.log("Server running in http://localhost:3000");
});