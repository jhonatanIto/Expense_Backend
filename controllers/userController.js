import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";

export const userData = async (req, res) => {
  try {
    const userId = req.userId;

    const [user] = await db
      .select({
        name: users.name,
        email: users.email,
        plan: users.plan,
      })
      .from(users)
      .where(eq(user.id, userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
