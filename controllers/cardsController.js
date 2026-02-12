import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { cards } from "../db/schema.js";

export const getCards = async (req, res) => {
  try {
    const userId = req.userId;

    const userCards = await db
      .select()
      .from(cards)
      .where(eq(cards.user_id, userId));

    if (userCards.length === 0)
      return res.status(404).json({ message: "cards not found" });

    res.status(200).json(userCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postCard = async (req, res) => {
  try {
    const { name, amount, type, category } = req.body;
    if (!name || !amount || !type)
      return res.status(400).json({ message: "fields missing" });

    const userId = req.userId;

    await db
      .insert(cards)
      .values({ name, amount, type, category, user_id: userId });

    res.status(201).json({ message: "card created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
