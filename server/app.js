const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: "*", // 👈 Permite cualquier origen (Postman + Frontend)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ruta base de prueba
app.get("/", (req, res) => {
  res.send("API de FlorteV2 funcionando 🚀");
});

// ✅ Rutas principales
app.use("/api", profileRoutes);

// ✅ Servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
