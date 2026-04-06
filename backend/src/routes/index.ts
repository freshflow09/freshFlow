import { Router } from "express";
import userRoutes from "../core/user/routes/user.routes";
import productRoutes from "../core/product/router/product.routes";
import batchRoutes from "../core/batch/router/batch.routes";

const apiRouter = Router();

apiRouter.use("/user", userRoutes);
apiRouter.use("/product", productRoutes);
apiRouter.use("/batch", batchRoutes);

export default apiRouter;
