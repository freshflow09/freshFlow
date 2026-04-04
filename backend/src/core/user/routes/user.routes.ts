import { Router } from "express";
import { addUser, loginUser } from "../controller/userContoller";

const router = Router();

router.post("/signup", addUser);
router.post("/signin", loginUser);
export default router;