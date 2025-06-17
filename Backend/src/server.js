import express from "express"
import usersRoute from "./routes/usersRoute.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

app.use("/api/users", usersRoute);

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log("Server started on Port:", PORT);
  });
});