import { Router } from "express";
import { addUser } from "../controller/userContoller";

const router = Router();

router.post("/register", addUser);
export default router;