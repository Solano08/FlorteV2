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

const getUserProfile = (req, res) => {
  try {
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const updateUserProfile = (req, res) => {
  try {
    const { name, phone, githubUrl, linkedinUrl, aboutMe } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y teléfono son campos requeridos'
      });
    }

    // Validate URLs if provided
    if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
      return res.status(400).json({
        success: false,
        message: 'La URL de GitHub debe ser válida'
      });
    }

    if (linkedinUrl && !linkedinUrl.startsWith('https://linkedin.com/')) {
      return res.status(400).json({
        success: false,
        message: 'La URL de LinkedIn debe ser válida'
      });
    }

    // Update user data
    userData = {
      ...userData,
      name: name || userData.name,
      phone: phone || userData.phone,
      githubUrl: githubUrl || userData.githubUrl,
      linkedinUrl: linkedinUrl || userData.linkedinUrl,
      aboutMe: aboutMe || userData.aboutMe,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};