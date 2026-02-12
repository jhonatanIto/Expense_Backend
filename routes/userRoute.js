import express from "express";
import { userData } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.use(authMiddleware);
userRoute.get("/", userData);

export default userRoute;
