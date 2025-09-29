const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock user data (in production, this would come from a database)
let userData = {
  id: 1,
  name: "Ana García Rodríguez",
  email: "ana.garcia@sena.edu.co",
  phone: "+57 300 123 4567",
  githubUrl: "https://github.com/ana-garcia",
  linkedinUrl: "https://linkedin.com/in/ana-garcia-dev",
  aboutMe: "Apasionada por el desarrollo web y la tecnología. Estudiante de ADSO en el SENA, enfocada en React, Node.js y bases de datos. Siempre buscando aprender nuevas tecnologías y contribuir a proyectos innovadores.",
  role: "Desarrolladora Full Stack Junior",
  location: "Colombia",
  joinDate: "Septiembre 2023"
};

// Routes
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    data: userData
  });
});

app.put('/api/user/profile', (req, res) => {
  const { name, phone, githubUrl, linkedinUrl, aboutMe } = req.body;
  
  // Validate required fields
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name and phone are required fields'
    });
  }

  // Update user data
  userData = {
    ...userData,
    name: name || userData.name,
    phone: phone || userData.phone,
    githubUrl: githubUrl || userData.githubUrl,
    linkedinUrl: linkedinUrl || userData.linkedinUrl,
    aboutMe: aboutMe || userData.aboutMe
  };

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: userData
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});