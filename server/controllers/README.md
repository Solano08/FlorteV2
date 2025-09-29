# FLORTE Backend Controllers

Este directorio contendrá los controladores de la API REST para FLORTE.

## Controladores Planificados

- `authController.js` - Autenticación y autorización
- `userController.js` - Gestión de usuarios y perfiles
- `postController.js` - Publicaciones y contenido
- `groupController.js` - Gestión de grupos
- `chatController.js` - Mensajería y chat
- `courseController.js` - Cursos y biblioteca

## Estructura Base

Cada controlador seguirá la estructura:

```javascript
// Ejemplo: userController.js
const User = require('../models/User');

const userController = {
  // GET /api/users
  getAllUsers: async (req, res) => {
    // Lógica aquí
  },
  
  // GET /api/users/:id
  getUserById: async (req, res) => {
    // Lógica aquí
  },
  
  // PUT /api/users/:id
  updateUser: async (req, res) => {
    // Lógica aquí
  },
  
  // DELETE /api/users/:id
  deleteUser: async (req, res) => {
    // Lógica aquí
  }
};

module.exports = userController;
```

## Tecnologías

- Node.js
- Express.js
- MySQL2
- JWT para autenticación
- bcrypt para encriptación
- multer para manejo de archivos