# Chatbots Education Survey System

Sistema integral de encuestas para investigar el uso de chatbots de IA en la educación de ingeniería de software. Basado en investigación académica sobre ChatGPT, Gemini, Bing y otros chatbots en contextos educativos.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roles de Usuario](#roles-de-usuario)
- [API Endpoints](#api-endpoints)
- [Contribución](#contribución)

## Características

### Frontend
- Diseño moderno y responsivo con Tailwind CSS
- Totalmente adaptable a móviles, tablets y desktop
- Sistema de autenticación completo (Login/Register)
- Gestión de usuarios con 3 roles (Admin, Teacher, Student)
- Dashboard con estadísticas y gráficos interactivos
- Encuestas para estudiantes y profesores
- Animaciones suaves y transiciones
- Accesibilidad (ARIA labels, navegación por teclado)

### Backend
- API RESTful con Node.js y Express
- Base de datos PostgreSQL
- Autenticación JWT
- Middleware de autorización por roles
- Sistema de estadísticas
- Validación de datos

## Tecnologías

### Frontend
- React 19.2.0
- React Router DOM 7
- Axios
- Tailwind CSS 3.4.18
- Lucide React (iconos)
- Chart.js + react-chartjs-2
- Yup (validación)

### Backend
- Node.js
- Express 5.1.0
- PostgreSQL
- JSON Web Tokens (JWT)
- Bcrypt
- Dotenv
- CORS

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-repositorio>
cd chatbots-education-survey
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../frontend
npm install
```

## Configuración

### Backend

1. Crear archivo `.env` en la carpeta `backend`:

```bash
cd backend
cp .env.example .env
```

2. Configurar variables de entorno en `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=chatbots_survey
DB_USERNAME=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

3. Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE chatbots_survey;
```

4. Ejecutar el script de inicialización de la base de datos:

```bash
psql -U postgres -d chatbots_survey -f database/init.sql
```

### Frontend

1. Crear archivo `.env` en la carpeta `frontend`:

```bash
cd frontend
cp .env.example .env
```

2. Configurar la URL del backend en `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Chatbots Education Survey
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

## Ejecución

### Desarrollo

#### Backend

```bash
cd backend
npm run dev
```

El servidor estará corriendo en `http://localhost:5000`

#### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará corriendo en `http://localhost:5173`

### Producción

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Estructura del Proyecto

```
chatbots-education-survey/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── studentSurveyController.js
│   │   └── teacherSurveyController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentSurvey.js
│   │   └── TeacherSurvey.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── studentSurveyRoutes.js
│   │   └── teacherSurveyRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   └── Input.jsx
    │   │   ├── dashboard/
    │   │   │   ├── Home.jsx
    │   │   │   └── Dashboard.jsx
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── surveys/
    │   │   │   ├── Student/
    │   │   │   └── Teacher/
    │   │   └── users/
    │   ├── context/
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── userService.js
    │   │   ├── studentSurveyService.js
    │   │   └── teacherSurveyService.js
    │   ├── utils/
    │   │   └── validationSchemas.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Roles de Usuario

### 1. Estudiante (student)
- Completar encuestas de estudiantes
- Ver y editar sus propias encuestas
- Ver estadísticas personales

### 2. Profesor (teacher)
- Completar encuestas de profesores
- Ver y editar sus propias encuestas
- Acceso a estadísticas de profesores

### 3. Administrador (admin)
- Acceso completo al sistema
- Gestión de usuarios
- Ver todas las encuestas
- Acceso a dashboard completo con estadísticas

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
GET    /api/auth/profile      - Obtener perfil (requiere auth)
```

### Usuarios
```
GET    /api/users             - Obtener todos (admin)
GET    /api/users/:id         - Obtener por ID
POST   /api/users             - Crear usuario (admin)
PUT    /api/users/:id         - Actualizar usuario
DELETE /api/users/:id         - Eliminar usuario (admin)
```

### Encuestas de Estudiantes
```
GET    /api/student-surveys              - Obtener todas (admin)
GET    /api/student-surveys/my-surveys   - Mis encuestas
GET    /api/student-surveys/statistics   - Estadísticas
GET    /api/student-surveys/:id          - Obtener por ID
POST   /api/student-surveys              - Crear encuesta
PUT    /api/student-surveys/:id          - Actualizar encuesta
DELETE /api/student-surveys/:id          - Eliminar encuesta
```

### Encuestas de Profesores
```
GET    /api/teacher-surveys              - Obtener todas (admin)
GET    /api/teacher-surveys/my-surveys   - Mis encuestas (teacher/admin)
GET    /api/teacher-surveys/statistics   - Estadísticas
GET    /api/teacher-surveys/:id          - Obtener por ID
POST   /api/teacher-surveys              - Crear encuesta (teacher/admin)
PUT    /api/teacher-surveys/:id          - Actualizar encuesta
DELETE /api/teacher-surveys/:id          - Eliminar encuesta
```

## Credenciales de Prueba

```
Admin:
Email: admin@test.com
Password: 123456

Profesor:
Email: profesor1@test.com
Password: 123456

Estudiante:
Email: estudiante1@test.com
Password: 123456
```

## Características de Responsividad

- Diseño mobile-first
- Breakpoints optimizados (sm, md, lg, xl, 2xl)
- Navegación adaptativa con menú hamburguesa
- Tablas con scroll horizontal en móviles
- Formularios optimizados para pantallas pequeñas
- Gráficos responsivos

## Características de UI/UX

- Animaciones suaves (fade-in, slide-up, scale)
- Transiciones en hover
- Loading states
- Skeleton screens
- Toast notifications
- Modal confirmations
- Breadcrumbs
- Badges y chips
- Cards con efectos hover

## Scripts Disponibles

### Backend
```bash
npm run dev      # Modo desarrollo con nodemon
npm start        # Modo producción
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## Base de Datos

### Tablas Principales

1. **users**
   - id (PK)
   - username
   - email (unique)
   - password (hashed)
   - role (student/teacher/admin)
   - created_at

2. **student_surveys**
   - id (PK)
   - user_id (FK)
   - has_used_chatbot
   - chatbots_used (array)
   - usage_frequency
   - usefulness_rating
   - tasks_used_for (array)
   - overall_experience
   - preferred_chatbot
   - effectiveness_comparison
   - will_continue_using
   - would_recommend
   - additional_comments
   - created_at

3. **teacher_surveys**
   - id (PK)
   - user_id (FK)
   - has_used_chatbot
   - chatbots_used (array)
   - courses_used (array)
   - purposes (array)
   - outcomes (array)
   - challenges (array)
   - likelihood_future_use
   - advantages (array)
   - concerns (array)
   - resources_needed (array)
   - age_range
   - institution_type
   - country
   - years_experience
   - additional_comments
   - created_at

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

Kadir Barquet

## Agradecimientos

- Basado en investigación académica sobre chatbots en educación
- Inspirado en el paper "Exploring the Frontier of Software Engineering Education with Chatbots"

## Soporte

Para soporte, abre un issue en el repositorio o contacta al autor.

---

Si este proyecto te fue útil, considera darle una estrella!