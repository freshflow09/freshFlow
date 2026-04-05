import { Router } from "express";
import userRoutes from "../core/user/routes/user.routes";
import productRoutes from "../core/product/router/product.routes";

const apiRouter = Router();

apiRouter.use("/user", userRoutes);
apiRouter.use("/product", productRoutes);

export default apiRouter;
