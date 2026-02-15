import { and, eq } from "drizzle-orm";
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
    const { name, amount, type, category, created_at } = req.body;
    if (!name || !amount || !type || !created_at)
      return res.status(400).json({ message: "fields missing" });
    const userId = req.userId;

    const data = { name, amount, type, created_at, user_id: userId };

    if (type === "expense") {
      data.category = category;
    }

    await db.insert(cards).values(data);

    res.status(201).json({ message: "card created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;
    if (!cardId) return res.status(400).json({ message: "Card id missing" });

    const [deletedCard] = await db
      .delete(cards)
      .where(and(eq(cards.id, cardId), eq(cards.user_id, userId)));

    if (!deletedCard)
      return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.userId;
    const { name, amount, category, type } = req.body;

    if (!name || !amount)
      return res.status(400).json({ message: "missing fields" });
    if (!cardId) return res.status(400).json({ message: "Card id missing" });

    const data = {
      name,
      amount,
    };

    if (type === "expense") {
      data.category = category;
    }

    const [updatedCard] = await db
      .update(cards)
      .set(data)
      .where(and(eq(cards.user_id, userId), eq(cards.id, cardId)))
      .returning();

    if (!updatedCard)
      return res.status(404).json({ message: "Card not found" });

    res.status(200).json({ message: "Card updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postBulkCards = async (req, res) => {
  try {
    const userId = req.userId;
    const { fixedCards } = req.body;

    if (!fixedCards || !Array.isArray(fixedCards))
      return res.status(400).json({ message: "Cards must be an array" });

    const cardsWithUser = fixedCards.map((c) => ({
      ...c,
      user_id: userId,
    }));

    await db.insert(cards).values(cardsWithUser);

    res.status(201).json({ message: "Cards created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
