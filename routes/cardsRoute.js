import express from "express";
import {
  deleteCard,
  getCards,
  postCard,
  updateCard,
  postBulkCards,
} from "../controllers/cardsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const cardsRoute = express.Router();

cardsRoute.use(authMiddleware);
cardsRoute.get("/", getCards);
cardsRoute.post("/", postCard);

cardsRoute.delete("/:cardId", deleteCard);
cardsRoute.put("/:cardId", updateCard);

cardsRoute.post("/bulk", postBulkCards);

export default cardsRoute;
