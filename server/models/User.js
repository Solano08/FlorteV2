// User model - In a real application, this would interact with a database
class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.githubUrl = data.githubUrl;
    this.linkedinUrl = data.linkedinUrl;
    this.aboutMe = data.aboutMe;
    this.role = data.role;
    this.location = data.location;
    this.joinDate = data.joinDate;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validation methods
  static validateProfile(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('El nombre es requerido');
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.push('El teléfono es requerido');
    }

    if (data.githubUrl && !data.githubUrl.startsWith('https://github.com/')) {
      errors.push('La URL de GitHub debe ser válida');
    }

    if (data.linkedinUrl && !data.linkedinUrl.startsWith('https://linkedin.com/')) {
      errors.push('La URL de LinkedIn debe ser válida');
    }

    return errors;
  }

  // Update profile method
  updateProfile(newData) {
    const validationErrors = User.validateProfile(newData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    this.name = newData.name || this.name;
    this.phone = newData.phone || this.phone;
    this.githubUrl = newData.githubUrl || this.githubUrl;
    this.linkedinUrl = newData.linkedinUrl || this.linkedinUrl;
    this.aboutMe = newData.aboutMe || this.aboutMe;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  // Convert to JSON for API responses
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      githubUrl: this.githubUrl,
      linkedinUrl: this.linkedinUrl,
      aboutMe: this.aboutMe,
      role: this.role,
      location: this.location,
      joinDate: this.joinDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;