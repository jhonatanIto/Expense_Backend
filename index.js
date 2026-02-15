import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import cardsRoute from "./routes/cardsRoute.js";
import authRoute from "./routes/authRoute.js";
import googleRoute from "./routes/googleRoute.js";

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-pied-six-60.vercel.app",
    ],
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "welcome to the backend" });
});

app.use("/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/cards", cardsRoute);
app.use("/googleAuth", googleRoute);

app.listen(port, () => console.log("Server is running on port: " + port));
