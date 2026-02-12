import { db } from "../db/connection.js";
import bcrypt from "bcrypt";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "missing fields" });

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must have more than 8 digits" });
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser)
      return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).json({ message: "missing fields" });

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return res.status(404).json({ message: "User not found" });

    const authorized = await bcrypt.compare(password, user.password);

    if (!authorized)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
