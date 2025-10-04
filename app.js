import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { loginRouter } from "./routes/loginRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { menuRouter } from "./routes/menuRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("./frontend/dist"));
app.use(express.json());
app.use(cors());

app.use("/login", loginRouter);
app.use("/proflie", profileRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter)

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


app.listen(port, () => {
  console.log(`Restaurant app listening on port ${port}`);
});
