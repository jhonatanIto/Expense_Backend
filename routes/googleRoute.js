import express from "express";
import { googleAuth } from "../controllers/googleController.js";

const googleRoute = express.Router();

googleRoute.post("/", googleAuth);

export default googleRoute;
