const express = require("express");
const cors = require("cors");

const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL === "*" ? "*" : [CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("API de FlorteV2 funcionando 🚀");
});

app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT ?? 5000);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
