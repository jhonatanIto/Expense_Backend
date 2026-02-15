import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email)
      return res.status(400).json({ message: "No email provided by Google" });

    let [googleUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!googleUser) {
      [googleUser] = await db
        .insert(users)
        .values({
          email,
          name,
          googleId: sub,
          picture,
        })
        .returning();
    }

    if (googleUser && !googleUser.googleId) {
      await db
        .update(users)
        .set({ googleId: sub })
        .where(eq(users.id, googleUser.id));
      googleUser.googleId = sub;
    }
    const appToken = jwt.sign({ id: googleUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: appToken,
      user: googleUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
