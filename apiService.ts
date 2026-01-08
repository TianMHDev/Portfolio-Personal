/**
 * Servicio de API para la comunicación con el backend de Quarkus.
 * Maneja todas las peticiones HTTP para proyectos, herramientas, perfil y autenticación.
 */

// URL base para el backend (Quarkus) con prefijo /api configurado en application.yml
const BASE = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const API_BASE_URL = BASE.endsWith('/api') ? BASE : `${BASE}/api`;

// Configuración de cabeceras comunes para las peticiones
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
});

/**
 * Función auxiliar para mapear datos del proyecto del backend al formato del frontend.
 */
const mapProject = (p: any) => ({
    ...p,
    // Sincronizar nombres: Backend (architecture, technologies) -> Frontend (category, stack)
    category: p.architecture || p.category || 'BACKEND',
    stack: p.technologies || p.stack || [],
    // Maneja múltiples imágenes si existen
    images: (Array.isArray(p.imageUrls) && p.imageUrls.length > 0)
        ? p.imageUrls.map((url: string) => ({ url, caption: p.title || 'Project Screenshot', type: 'screenshot' }))
        : (p.imageUrl ? [{ url: p.imageUrl, caption: p.title || 'Project Screenshot', type: 'screenshot' }] : []),
    liveUrl: p.demoUrl || p.liveUrl || ''
});

export const apiService = {
    // --- GESTIÓN DE PROYECTOS ---

    /** Obtener todos los proyectos */
    async getProjects() {
        const res = await fetch(`${API_BASE_URL}/projects`);
        if (!res.ok) throw new Error('Error al cargar proyectos');
        const data = await res.json();
        return data.map(mapProject);
    },

    /** Crear un nuevo proyecto */
    async createProject(projectData: any) {
        const res = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(projectData)
        });
        if (!res.ok) throw new Error('Error al crear proyecto');
        return res.json();
    },

    /** Actualizar un proyecto existente */
    async updateProject(id: number, projectData: any) {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(projectData)
        });
        if (!res.ok) throw new Error('Error al actualizar proyecto');
        return res.json();
    },

    /** Eliminar un proyecto */
    async deleteProject(id: number) {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error al eliminar proyecto');
        return true;
    },

    // --- GESTIÓN DE HERRAMIENTAS (LEARNING TOOLS) ---

    /** Obtener todas las habilidades/herramientas */
    async getLearningTools() {
        const res = await fetch(`${API_BASE_URL}/learning-tools`);
        if (!res.ok) throw new Error('Error al cargar herramientas');
        return res.json();
    },

    /** Crear una nueva habilidad */
    async createTool(toolData: any) {
        const res = await fetch(`${API_BASE_URL}/learning-tools`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(toolData)
        });
        if (!res.ok) throw new Error('Error al crear herramienta');
        return res.json();
    },

    /** Actualizar una habilidad existente */
    async updateTool(id: number, toolData: any) {
        const res = await fetch(`${API_BASE_URL}/learning-tools/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(toolData)
        });
        if (!res.ok) throw new Error('Error al actualizar herramienta');
        return res.json();
    },

    /** Eliminar una habilidad */
    async deleteTool(id: number) {
        const res = await fetch(`${API_BASE_URL}/learning-tools/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Error al eliminar herramienta');
        return true;
    },

    // --- GESTIÓN DE PERFIL ---

    /** Obtener datos del perfil global */
    async getProfile() {
        const res = await fetch(`${API_BASE_URL}/profile`);
        if (!res.ok) return null;
        return res.json();
    },

    /** Actualizar datos del perfil */
    async updateProfile(profileData: any) {
        const res = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(profileData)
        });
        if (!res.ok) throw new Error('Error al actualizar perfil');
        return res.json();
    },

    // --- AUTENTICACIÓN ---

    /** Iniciar sesión en el panel de administración */
    async login(credentials: any) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
    },

    // --- CONTACTO ---

    /** Enviar mensaje desde el formulario de contacto */
    async sendMessage(messageData: any) {
        const res = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        });
        if (!res.ok) throw new Error('Error al enviar mensaje');
        return true;
    }
};
