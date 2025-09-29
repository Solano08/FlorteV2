# FLORTE Backend Models

Este directorio contendrá los modelos de datos para la base de datos MySQL.

## Modelos Planificados

- `User.js` - Modelo de usuario
- `Post.js` - Modelo de publicaciones
- `Group.js` - Modelo de grupos
- `Message.js` - Modelo de mensajes
- `Course.js` - Modelo de cursos
- `Achievement.js` - Modelo de logros

## Estructura Base

Cada modelo seguirá la estructura:

```javascript
// Ejemplo: User.js
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.avatar = data.avatar;
    this.bio = data.bio;
    this.github_url = data.github_url;
    this.linkedin_url = data.linkedin_url;
    this.phone = data.phone;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    // Lógica de consulta
  }

  static async findById(id) {
    // Lógica de consulta por ID
  }

  async save() {
    // Lógica para guardar/actualizar
  }

  async delete() {
    // Lógica para eliminar
  }
}

module.exports = User;
```

## Relaciones

- User -> hasMany Posts
- User -> belongsToMany Groups
- User -> hasMany Messages
- Group -> hasMany Users
- Post -> belongsTo User
- Message -> belongsTo User