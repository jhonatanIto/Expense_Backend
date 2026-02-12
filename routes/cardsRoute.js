import express from "express";
import { getCards, postCard } from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const cardsRoute = express.Router();

cardsRoute.use(authMiddleware);
cardsRoute.get("/", getCards);
cardsRoute.post("/", postCard);

export default cardsRoute;
