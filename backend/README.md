# ⚙️ Portfolio Backend - Quarkus API

Este es el motor que alimenta el portafolio profesional de Sebastian Marriaga. Está construido con **Quarkus**, enfocado en alto rendimiento, bajo consumo de memoria y una arquitectura limpia.

## 🚀 Características del Backend

- **Arquitectura Hexagonal:** Separación estricta entre dominio, aplicación e infraestructura.
- **Seguridad JWT:** Implementación manual de autenticación con tokens firmados mediante RSA.
- **Base de Datos Dinámica:** Gestión de proyectos, perfil y herramientas de aprendizaje a través de PostgreSQL.
- **Servicio de Correo:** Integración con Quarkus Mailer para recepción de mensajes de contacto.
- **Documentación:** Swagger UI disponible en `/swagger-ui`.

## 🛠️ Tecnologías

- **Java 17**
- **Quarkus Framework**
- **Hibernate Panache** (Active Record Pattern)
- **PostgreSQL**
- **Maven**
- **SmallRye JWT & OpenAPI**

## 🔧 Configuración para Desarrollo

1.  Asegúrate de tener un servidor **PostgreSQL** corriendo.
2.  Configura las variables de conexión en `src/main/resources/application.yml`.
3.  **Seguridad:** Debes incluir tus claves `privateKey.pem` y `publicKey.pem` en `src/main/resources`. (Nota: Estas claves no se suben al repositorio por seguridad).
4.  Ejecuta con:
    ```bash
    ./mvnw quarkus:dev
    ```

## 📦 Empaquetado

```bash
./mvnw package
```

Esto generará un jar ejecutable en `target/quarkus-app/`.
