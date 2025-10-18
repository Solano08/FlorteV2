const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// ✅ Obtener perfil por ID
router.get("/profile/:id", profileController.getProfile);

// ✅ Actualizar perfil por ID
router.put("/profile/:id", profileController.updateProfile);

// ✅ Eliminar perfil (soft delete)
router.delete("/profile/:id", profileController.deleteProfile);

// ✅ Restaurar perfil
router.patch("/profile/:id/restore", profileController.restoreProfile);

module.exports = router;
