-- Semilla de usuario ADMIN (password: Tian2127*)
-- NOTA: En producción, usar contraseñas hasheadas
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'ADMIN');

-- Proyectos de ejemplo detallados
INSERT INTO projects (title, description, architecture, problem, learning, githubUrl, demoUrl, imageUrl) 
VALUES ('Vortex Backend', 'Motor de gestión de incidentes con Quarkus', 'Hexagonal', 'Optimizar el seguimiento de tickets', 'Aprendizaje de Quarkus y Mutiny', 'https://github.com/sebastian/vortex', 'https://vortex.demo', 'https://vortex.img');

-- Tecnologías para el proyecto 1
INSERT INTO project_technologies (project_id, technology) VALUES (1, 'Java');
INSERT INTO project_technologies (project_id, technology) VALUES (1, 'Quarkus');
INSERT INTO project_technologies (project_id, technology) VALUES (1, 'PostgreSQL');

-- Features para el proyecto 1
INSERT INTO project_features (project_id, feature) VALUES (1, 'Gestión de Incidentes Automatizada');
INSERT INTO project_features (project_id, feature) VALUES (1, 'Notificaciones en tiempo real');

-- Herramientas en aprendizaje
INSERT INTO learning_tools (name, category, status, progress) 
VALUES ('Quarkus', 'Backend', 'LEARNING', 80);
INSERT INTO learning_tools (name, category, status, progress) 
VALUES ('PostgreSQL', 'Database', 'MASTERED', 100);
