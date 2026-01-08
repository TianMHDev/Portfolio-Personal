import React from 'react';
import { Project, TechCategory } from './types';

/**
 * DATOS DE PRESENTACIÓN: HERO SECTION
 * Información principal que aparece al cargar la web.
 */
export const HERO_DATA = {
  name: "SEBASTIAN MARRIAGA",
  role: "BACKEND DEVELOPER JUNIOR",
  manifesto: "CÓDIGO SÓLIDO, INTERFACES FUNCIONALES, RESULTADOS REALES",
  location: "Barranquilla, Colombia (Remoto / Híbrido)",
  status: "ACTUALMENTE: APRENDIENDO QUARKUS"
};

/**
 * DATOS DE PERFIL: SOBRE MÍ
 * Información narrativa y personal.
 */
export const ABOUT_DATA = {
  title: "PERFIL_HÍBRIDO",
  description: `Soy un Backend Developer Junior con una visión integral del desarrollo web. Mi fortaleza reside en la lógica del servidor, bases de datos y APIs, complementada con habilidades en Frontend (Angular/HTML/CSS).

Esta versatilidad me permite construir soluciones completas, desde el "motor" hasta la interfaz, garantizando una comunicación fluida entre capas. Me defino por mi constancia, mentalidad de ingeniero y compromiso con la calidad.`,
  englishLevel: "Inglés Técnico (Básico/Pre-Intermedio) - Lectura y escritura técnica.",
  currentlyLearning: "Quarkus",
  profileImage: "https://avatars.githubusercontent.com/u/211703811?s=400&u=e09c4e6ffe4a2964a5092000a06af0ae8da045d8&v=4"
};

/**
 * STACK TECNOLÓGICO: TECH_ARSENAL
 * Categorización de habilidades técnicas principales.
 */
export const TECH_STACK: TechCategory[] = [
  {
    title: "LENGUAJES & FRONTEND",
    skills: ["Java (Principal)", "JavaScript / TypeScript", "Python 3", "HTML5 & CSS3", "Angular (Nivel Básico)"]
  },
  {
    title: "BACKEND FRAMEWORKS",
    skills: ["Spring Boot 3", "Node.js + Express", "JPA / Hibernate", "Manejo de APIs REST"]
  },
  {
    title: "DATOS & PERSISTENCIA",
    skills: ["PostgreSQL", "MySQL", "MongoDB (Nivel Básico)", "Diseño de Esquemas ER"]
  },
  {
    title: "HERRAMIENTAS & CONCEPTOS",
    skills: ["Git & GitHub", "Postman / Swagger", "JWT Auth", "Clean Code", "Arquitectura en Capas"]
  }
];

/**
 * CULTURA Y MENTALIDAD
 * Soft skills y enfoques profesionales.
 */
export const SKILLS_MINDSET = [
  { title: "Visión Full Stack", desc: "Capacidad para entender y conectar ambos lados de la aplicación (Cliente y Servidor)." },
  { title: "Mentalidad de Aprendiz", desc: "Disciplina y curiosidad para dominar nuevas tecnologías, ya sea en Back o Front." },
  { title: "Enfoque en Calidad", desc: "Código limpio y estructurado, tanto en la lógica de negocio como en la maquetación." },
  { title: "Resolución de Problemas", desc: "Enfoque lógico para descomponer requerimientos complejos en soluciones funcionales." }
];

/**
 * PROYECTOS PREESTABLECIDOS (LOCALES)
 * Datos estáticos que sirven como base antes de la sincronización con la DB.
 */
export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Open Book",
    category: "BACKEND / API",
    stack: ["JavaScript", "Node.js", "Express", "MySQL", "JWT Auth", "Open Library API"],
    description: "API RESTful para el descubrimiento y gestión de libros, con ingesta masiva desde Open Library.",
    problem: "Sincronizar miles de libros desde una API externa garantizando integridad y bajo tiempo de respuesta.",
    learning: "Motores de ingesta masiva, transacciones SQL, Rate Limiting y limpieza de datos no estructurados.",
    features: [
      "Sincronización automática con Open Library",
      "API RESTful con búsqueda avanzada y paginación",
      "Gestión de estados de lectura y favoritos",
      "Seguridad mediante Middleware y JWT"
    ],
    githubUrl: "https://github.com/TianMHDev/OpenBook.git",
    liveUrl: "https://openbook-7anq.onrender.com/",
    images: [
      { url: "/projects/landingpageopenbook.webp", caption: "Landing Page", type: "screenshot" },
      { url: "/projects/catalogosopenbook.webp", caption: "Catálogo", type: "screenshot" },
      { url: "/projects/loginopenbook.webp", caption: "Login", type: "screenshot" },
      { url: "/projects/registeropenbook.webp", caption: "Registro", type: "screenshot" }
    ],
    version: "1.1.0"
  },
  {
    id: "2",
    title: "Task Management System",
    category: "FULLSTACK / JAVA",
    stack: ["Java", "Spring Boot", "MySQL", "Docker", "Postman", "JWT Auth", "Arquitectura Hexagonal"],
    description: "Gestión empresarial de proyectos: Backend en Spring Boot, Arquitectura Hexagonal y Frontend en Vanilla JS.",
    problem: "Desarrollar un sistema altamente desacoplado y escalable evitando las limitaciones de las capas tradicionales.",
    learning: "Implementación de Puertos y Adaptadores, independencia del dominio y optimización con Spring Cache.",
    features: [
      "Autenticación robusta con JWT",
      "Contenerización con Docker & Cloud MySQL",
      "Arquitectura Hexagonal Pura",
      "Optimistic UI para respuesta instantánea"
    ],
    githubUrl: "https://github.com/TianMHDev/Sistema-de-Gesti-n-de-Proyectos-y-Tareas.git",
    liveUrl: "https://sistema-de-gesti-n-de-proyectos-y-t.vercel.app/",
    images: [
      { url: "/projects/proyectostaskflow.webp", caption: "Dashboard Proyectos", type: "screenshot" },
      { url: "/projects/tareastaskflow.webp", caption: "Gestión de Tareas", type: "screenshot" },
      { url: "/projects/logintaskflow.webp", caption: "Acceso", type: "screenshot" },
      { url: "/projects/registertaskflow.webp", caption: "Registro de Equipo", type: "screenshot" }
    ],
    version: "1.1.0"
  },
  {
    id: "3",
    title: "Vortex Incident",
    category: "BACKEND / JAVA / SPRING BOOT",
    stack: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Postman", "JWT Auth", "Arquitectura Hexagonal"],
    description: "Motor de gestión de incidentes con automatización de SLAs y clasificación de criticidad.",
    problem: "Gestionar ineficiencias mediante la automatización de prioridades y seguimiento de niveles de servicio.",
    learning: "Microservicios en Java con Arquitectura Hexagonal, garantizando desacoplamiento total y escalabilidad.",
    features: [
      "Gestión automatizada de SLAs y prioridad",
      "Arquitectura Hexagonal (Domain-Centric)",
      "Persistencia relacional avanzada con PostgreSQL",
      "Infraestructura contenerizada con Docker"
    ],
    githubUrl: "https://github.com/Vortex-Incidents/vortex-frontend-react.git",
    liveUrl: "https://vortex-frontend-react.vercel.app/",
    images: [
      { url: "/projects/landingpagevortex.webp", caption: "Vortex Home", type: "screenshot" },
      { url: "/projects/loginvortex.webp", caption: "Autenticación", type: "screenshot" },
      { url: "/projects/adminvortex.webp", caption: "Panel Admin", type: "screenshot" },
      { url: "/projects/empleadovortex.webp", caption: "Vista Empleado", type: "screenshot" }
    ],
    version: "1.1.0"
  }
];