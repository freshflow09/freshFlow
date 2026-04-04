import { Router } from "express";
import userRoutes from "../core/user/routes/user.routes";

const apiRouter = Router();

apiRouter.use("/user", userRoutes);

export default apiRouter;
