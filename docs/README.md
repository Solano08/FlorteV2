# FLORTE - Documentación

## Sobre FLORTE

FLORTE es una plataforma educativa y red social diseñada para estudiantes y profesionales del ámbito tecnológico, especialmente aquellos vinculados al SENA (Servicio Nacional de Aprendizaje).

## Características Principales

- **Red Social Educativa**: Conexión entre estudiantes y profesionales
- **Gestión de Proyectos**: Seguimiento y colaboración en proyectos
- **Biblioteca de Recursos**: Acceso a materiales educativos
- **Sistema de Grupos**: Organización por áreas de interés
- **Chat Integrado**: Comunicación en tiempo real
- **Sistema de Logros**: Reconocimiento del progreso

## Arquitectura Técnica

### Frontend
- **Framework**: React 18 con TypeScript
- **Estilado**: TailwindCSS
- **Componentes**: Radix UI
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Backend (Planificado)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MySQL
- **ORM**: Sequelize o consultas nativas
- **Autenticación**: JWT

### Diseño
- **Tema Principal**: Modo oscuro
- **Colores**: Púrpura (#8B5CF6), Verde SENA (#39A900)
- **Tipografía**: Work Sans
- **Componentes**: Sistema de diseño personalizado

## Estructura del Proyecto

```
florte/
├── client/          # Frontend React
├── server/          # Backend Node.js/Express
├── database/        # Scripts SQL y migraciones
└── docs/           # Documentación
```

## Roadmap de Desarrollo

### Fase 1 - MVP ✅
- [x] Diseño básico y componentes
- [x] Navegación principal
- [x] Páginas de perfil y dashboard
- [x] Sistema de diseño

### Fase 2 - Core Features
- [ ] Sistema de autenticación
- [ ] API REST básica
- [ ] Base de datos MySQL
- [ ] CRUD de usuarios y posts

### Fase 3 - Features Avanzadas
- [ ] Chat en tiempo real
- [ ] Sistema de grupos
- [ ] Biblioteca de recursos
- [ ] Notificaciones push

### Fase 4 - Optimizaciones
- [ ] PWA capabilities
- [ ] Performance optimizations
- [ ] SEO improvements
- [ ] Analytics integration

## Guía de Contribución

Por definir durante el desarrollo colaborativo.

## Licencia

Por definir.