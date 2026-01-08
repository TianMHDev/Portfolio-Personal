# 🚀 Portfolio de Desarrollo - Sebastian Marriaga

Este proyecto es un portafolio profesional personal diseñado con una estética ciberpunk moderna, que funciona como un sistema dinámico (Full Stack). No es solo una página estática; cuenta con un potente backend y un panel administrativo para gestionar proyectos, habilidades e información en tiempo real.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** React 19 + Vite
- **Lenguaje:** TypeScript
- **Estilos:** CSS3 Moderno (Glassmorphism, Variables CSS, Grid/Flexbox)
- **Iconografía:** Lucide React
- **Navegación:** React Router 7

### Backend (Quarkus)
- **Framework:** Quarkus (Java 17+)
- **Persistencia:** Hibernate ORM con Panache
- **Base de Datos:** PostgreSQL
- **Seguridad:** JWT (JSON Web Token) con claves RSA (.pem)
- **Documentación:** OpenAPI + Swagger UI
- **Mensajería:** Mailer (Quarkus) para formulario de contacto

---

## ✨ Características Principales

1. **Panel Administrativo (CMS):** Acceso seguro para gestionar el contenido del portafolio (CRUD de proyectos y habilidades) sin modificar código.
2. **Estética Ciberpunk:** Interfaz visualmente impactante con efectos de escaneo, neones y animaciones suaves.
3. **Arquitectura Hexagonal:** El backend está diseñado siguiendo principios de arquitectura limpia para facilitar el mantenimiento.
4. **Formulario de Contacto:** Integración con servicio de correo para comunicación directa.
5. **Responsive Design:** Adaptado para una experiencia fluida tanto en escritorio como en dispositivos móviles.

---

## 🚀 Configuración Local

### Requisitos Previos
- Node.js (v18+)
- Java JDK 17 o superior
- Maven
- PostgreSQL

### 🖥️ Frontend
1. Entra en la raíz del proyecto.
2. Instala dependencias: `npm install`
3. Crea un archivo `.env.local` y define la URL del backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
4. Inicia en modo desarrollo: `npm run dev`

### ⚙️ Backend
1. Entra en la carpeta `/backend`.
2. Configura las variables de entorno en `src/main/resources/application.yml` o mediante variables de sistema compatibles con Quarkus.
3. Genera tus claves RSA para JWT si no las tienes (necesitarás `privateKey.pem` y `publicKey.pem` en `resources`).
4. Ejecuta el backend en modo desarrollo:
   ```bash
   ./mvnw compile quarkus:dev
   ```

---

## 🌍 Notas de Despliegue

Para desplegar este proyecto en producción (ej. Render, Vercel, Railway), asegúrate de configurar las siguientes variables de entorno:

| Variable | Descripción |
| :--- | :--- |
| `DB_USERNAME` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_HOST` | Host de la base de datos |
| `MAIL_PASSWORD` | App Password de Gmail (o el proveedor que uses) |
| `VITE_API_BASE_URL` | URL de tu backend desplegado |

> **IMPORTANTE:** Nunca subas tus archivos `.pem` o contraseñas reales al repositorio. Este proyecto ya cuenta con un `.gitignore` robusto para evitarlo.

---

## 👤 Autor
**Sebastian Marriaga**
- GitHub: [@TianMHDev](https://github.com/TianMHDev)
- LinkedIn: [Sebastian Marriaga Hoyos](https://linkedin.com/in/tu-perfil)

---

"Código sólido, interfaces funcionales, resultados reales."
