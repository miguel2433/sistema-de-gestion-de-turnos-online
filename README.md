# 🏥 Sistema de Turnos Online

Este proyecto implementa un **sistema completo de turnos online para hospitales**.  
Está dividido en dos partes principales:  
- **Backend:** desarrollado con Node.js y Express, conectado a MongoDB.  
- **Frontend:** desarrollado con tecnologías web y conexión a Firebase para hosting y analíticas.

El sistema permite a los pacientes **reservar, modificar o cancelar turnos médicos** y a los profesionales **gestionar su disponibilidad y horarios** de forma eficiente, segura y accesible desde cualquier dispositivo.

---

## 🚀 Tecnologías utilizadas

### 🔧 **Backend**
- **Node.js** → Entorno de ejecución para JavaScript del lado del servidor.
- **Express.js** → Framework minimalista para gestionar rutas, peticiones y respuestas HTTP.
- **Mongoose** → ODM para conectar y modelar datos en **MongoDB**.
- **mongoose-sequence** → Genera identificadores automáticos y consecutivos (útil para numerar turnos o pacientes).
- **bcrypt** → Cifra contraseñas antes de guardarlas en la base de datos, protegiendo la información sensible.
- **jsonwebtoken (JWT)** → Implementa autenticación segura basada en tokens.
- **cors** → Permite que el servidor sea accesible desde diferentes dominios o IPs (ideal para frontend separado).
- **cookie-parser** → Gestiona cookies en las peticiones HTTP.
- **dotenv** → Carga variables de entorno desde un archivo `.env`.

### 🌐 **Frontend**
- **HTML / CSS / JavaScript** → Estructura y estilo de la interfaz de usuario.
- **Firebase Hosting** → Utilizado para **hospedar el frontend** y permitir el acceso remoto desde cualquier dispositivo.
- **Firebase Analytics** → Permite recolectar estadísticas de uso y comportamiento de los usuarios.

### ☁️ **Base de datos**
- **MongoDB** (Atlas o local) → Base de datos NoSQL donde se almacenan usuarios, médicos, especialidades y turnos.

---

## 🧩 Arquitectura general del sistema

El sistema está dividido en tres capas principales:

- El **frontend** se comunica con el **backend** mediante peticiones HTTP (API REST).
- El **backend** gestiona las operaciones de negocio, autenticación y acceso a datos.
- La **base de datos** almacena toda la información de usuarios, médicos, turnos, y configuraciones del hospital.

---

---

## ⚙️ Instalación y ejecución

### 🔸 **1️⃣ Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/turnos-online.git
cd turnos-online
```

### 🔸 **2️⃣ Configurar el backend**
```bash
- cd backend
- npm install

Crear un archivo .env en la raíz del backend con tus variables:
- PORT=4000
- MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/turnos
- JWT_SECRET=claveSuperSecreta

Iniciar el servidor:
- npm run dev
```
### 🔸 **3️⃣ Configurar el frontend**
```bash
En frontend/firebase.js incluir tu configuración de Firebase:
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

Desplegar el frontend en Firebase:
- firebase login
- firebase init
- firebase deploy
```
### 🧠Funcionalidades principales
- Registro e inicio de sesión de pacientes y médicos.
- Reserva, modificación y cancelación de turnos.
- Visualización de turnos por fecha, especialidad o médico.
- Gestión de disponibilidad y horarios médicos.
- Seguridad en el acceso mediante tokens (JWT).
- Soporte para múltiples dispositivos (web y móvil).
- Analítica de uso mediante Firebase Analytics.

### **Backend**
```bash
Iniciar el servidor:
- npm start
```

### **Firebase**
```bash
Servir el sitio localmente:
- firebase serve

Publicar el frontend en Firebase Hosting:
- firebase deploy
```

### 👨‍💻**Autores**
- Desarrollado por: Miguel Verduguez, Joel Tito y Luz Ibarra
- GitHub User: miguel2433, tito160 y luzIbarra7.
