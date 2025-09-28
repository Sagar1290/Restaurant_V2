import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { loginRouter } from "./routes/loginRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { menuRouter } from "./routes/menuRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("./frontend/dist"));
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/login", loginRouter);
app.use("/proflie", profileRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter)

app.listen(port, () => {
  console.log(`Restaurant app listening on port ${port}`);
});
