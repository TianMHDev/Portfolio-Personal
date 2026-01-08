import React, { useState, useEffect } from 'react';
import { Terminal, Lock, LogOut, Plus, Trash2, Edit2, Book, Layers, Save, X, ExternalLink, User, CheckCircle2, Globe, XCircle, Menu } from 'lucide-react';
import { apiService } from './apiService';
import { CyberCard, Badge } from './components/CyberComponents';
import CyberToast from './components/CyberToast';
import { Project } from './types';

/**
 * COMPONENTE: PANEL DE ADMINISTRACIÓN (CMS)
 * Proporciona una interfaz segura para que el propietario gestione el contenido
 * del portafolio (Proyectos, Perfil y Skills) sin tocar el código.
 */
const Admin: React.FC = () => {
    // --- ESTADOS DE AUTENTICACIÓN ---
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // --- ESTADOS DE NAVEGACIÓN Y DATOS ---
    const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setToast({ message, type });
    };

    // --- ESTADOS DE MODALES ---
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showToolModal, setShowToolModal] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [editingTool, setEditingTool] = useState<any>(null);
    const [confirmModal, setConfirmModal] = useState<{ message: string, onConfirm: () => void } | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        if (isLoggedIn) {
            loadData();
        }
    }, [isLoggedIn, activeTab]);

    /** Carga información desde el backend según la pestaña activa */
    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'projects') {
                const data = await apiService.getProjects();
                setProjects(data);
            } else if (activeTab === 'profile') {
                const toolsData = await apiService.getLearningTools();
                const profileData = await apiService.getProfile();
                setTools(toolsData);
                setProfile(profileData);
            }
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- GESTIÓN DE SESIÓN (Login/Logout) ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await apiService.login({ username, password });
            localStorage.setItem('adminToken', data.token);
            setIsLoggedIn(true);
            showToast('CONEXIÓN_ESTABLECIDA: Acceso autorizado', 'success');
        } catch (err) {
            setError('ACCESO_DENEGADO: Credenciales incorrectas');
            showToast('ACCESO_DENEGADO: Credenciales incorrectas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        showToast('SESIÓN_FINALIZADA: Desconexión segura', 'info');
    };

    // --- OPERACIONES: PROYECTOS (CRUD) ---

    /** Abre modal de confirmación antes de borrar proyecto */
    const handleDeleteProject = (id: string) => {
        setConfirmModal({
            message: '¿ELIMINAR_ESTE_RECURSO_PERMANENTEMENTE?',
            onConfirm: async () => {
                try {
                    await apiService.deleteProject(Number(id));
                    loadData();
                    showToast('RECURSO_ELIMINADO_DE_LA_RED', 'success');
                } catch (err) {
                    showToast('SISTEMA_ERROR: No se pudo eliminar', 'error');
                }
                setConfirmModal(null);
            }
        });
    };

    /** Crea o Actualiza un proyecto en el backend */
    const saveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const projectData = {
            title: formData.get('title'),
            architecture: formData.get('category'),
            description: formData.get('description'),
            problem: formData.get('problem'),
            learning: formData.get('learning'),
            features: (formData.get('features') as string).split('\n').filter(f => f.trim()),
            technologies: (formData.get('stack') as string).split(',').map(s => s.trim()),
            githubUrl: formData.get('githubUrl'),
            demoUrl: formData.get('liveUrl'),
            imageUrls: [
                formData.get('imageUrl1'),
                formData.get('imageUrl2'),
                formData.get('imageUrl3'),
                formData.get('imageUrl4')
            ].filter(url => url && (url as string).trim()),
            version: formData.get('version') || '1.0.0'
        };

        try {
            if (editingProject) {
                await apiService.updateProject(Number(editingProject.id), projectData);
            } else {
                await apiService.createProject(projectData);
            }
            setShowProjectModal(false);
            setEditingProject(null);
            loadData();
            showToast(`PROYECTO_${editingProject ? 'ACTUALIZADO' : 'CREADO'}_EXITOSAMENTE`, 'success');
        } catch (err) {
            showToast('ERROR_DE_PERSISTENCIA: Revisa la conexión con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- OPERACIONES: HABILIDADES / TOOLS (CRUD) ---

    /** Crea o Actualiza una herramienta del stack */
    const saveTool = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const toolData = {
            name: formData.get('name'),
            category: formData.get('category'),
            status: formData.get('status'),
            progress: 0 // Valor por defecto requerido por el backend
        };

        try {
            if (editingTool) {
                await apiService.updateTool(editingTool.id, toolData);

                // Auto-actualización si ya se domina la tecnología
                if (toolData.status === 'MASTERED' && profile && profile.currentlyLearning === toolData.name) {
                    await apiService.updateProfile({
                        ...profile,
                        currentlyLearning: "Elegir nuevo objetivo...",
                        status: "DISPONIBLE PARA NUEVOS RETOS"
                    });
                }
            } else {
                await apiService.createTool(toolData);
            }
            setShowToolModal(false);
            setEditingTool(null);
            loadData();
            showToast(`HABILIDAD_${editingTool ? 'ACTUALIZADA' : 'REGISTRADA'}_CON_ÉXITO`, 'success');
        } catch (err) {
            showToast('ERROR: No se pudo guardar la habilidad', 'error');
        } finally {
            setLoading(false);
        }
    };

    /** Abre modal confirmación para borrar skill de la base de datos */
    const handleDeleteTool = (id: number) => {
        setConfirmModal({
            message: '¿ELIMINAR_ESTE_CONOCIMIENTO_DE_LA_MATRIZ?',
            onConfirm: async () => {
                try {
                    await apiService.deleteTool(id);
                    loadData();
                    showToast('CONOCIMIENTO_ELIMINADO_CON_ÉXITO', 'success');
                } catch (err) {
                    showToast('SISTEMA_ERROR: No se pudo purgar el dato', 'error');
                }
                setConfirmModal(null);
            }
        });
    };

    // --- OPERACIONES: PERFIL GLOBAL ---

    /** Sincroniza toda la información del perfil del desarrollador */
    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const profileData = {
            id: profile?.id || 1,
            name: formData.get('name'),
            role: formData.get('role'),
            manifesto: formData.get('manifesto'),
            location: formData.get('location'),
            status: formData.get('status'),
            aboutTitle: formData.get('aboutTitle'),
            aboutDescription: formData.get('aboutDescription'),
            englishLevel: formData.get('englishLevel'),
            currentlyLearning: formData.get('currentlyLearning'),
            profileImage: formData.get('profileImage')
        };

        try {
            await apiService.updateProfile(profileData);
            showToast('PERFIL_SINCRONIZADO_GLOBALMENTE', 'success');
            loadData();
        } catch (err) {
            showToast('ERROR: Fallo en la sincronización del perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZADO: INTERFAZ DE AUTENTICACIÓN ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cyber-black p-6">
                <CyberCard className="w-full max-w-md border-cyber-cyan/30 border-2">
                    <div className="flex items-center gap-2 text-cyber-cyan mb-8">
                        <Lock size={24} />
                        <h2 className="text-2xl font-display font-bold uppercase tracking-tighter italic">Acceso_al_Núcleo</h2>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-mono text-gray-500 uppercase mb-2 ml-1">Terminal_ID</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-black border border-cyber-dark p-4 text-cyber-cyan focus:border-cyber-cyan outline-none font-mono text-sm sm:text-base" />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-mono text-gray-500 uppercase mb-2 ml-1">Código_Encriptado</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black border border-cyber-dark p-4 text-cyber-cyan focus:border-cyber-cyan outline-none font-mono text-sm sm:text-base" />
                        </div>
                        {error && <p className="text-red-500 font-mono text-xs border border-red-500/30 p-3 bg-red-500/10 italic text-center uppercase">{error}</p>}
                        <button disabled={loading} className="w-full bg-cyber-cyan text-black font-bold p-4 uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-sm sm:text-base">
                            {loading ? 'AUTENTICANDO...' : 'Sincronizar_Conexión'}
                        </button>
                    </form>
                </CyberCard>
            </div>
        );
    }

    // --- RENDERIZADO: PANEL PRINCIPAL (AUTENTICADO) ---
    return (
        <div className="min-h-screen bg-cyber-black text-white font-body p-6 md:p-12">
            {/* HEADER PROFESIONAL - RESPONSIVO */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-dark">
                <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 border border-cyber-cyan rounded-xs">
                            <Terminal size={18} className="text-cyber-cyan animate-pulse" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tighter uppercase italic">PANEL_ADMIN</h1>
                            <p className="text-[10px] lg:text-xs text-cyber-green font-mono uppercase tracking-[0.2em]">EN_LINEA // ACCESO_NIVEL_1</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-8 mr-6 border-r border-cyber-dark pr-6">
                            <a href="/" target="_blank" className="text-xs lg:text-sm font-mono text-gray-400 hover:text-cyber-cyan flex items-center gap-1 transition-all uppercase tracking-widest">
                                <ExternalLink size={14} /> VER_SITE
                            </a>
                            <button onClick={handleLogout} className="text-xs lg:text-sm font-mono text-gray-500 hover:text-red-500 transition-all uppercase tracking-widest">
                                [DESCONECTAR]
                            </button>
                        </div>

                        {/* Botón de Menú Móvil */}
                        <button
                            className="lg:hidden p-2 text-cyber-cyan border border-cyber-cyan/30 rounded"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* OVERLAY MENÚ MÓVIL */}
            <div className={`fixed inset-0 z-50 bg-cyber-black/98 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-2 text-cyber-cyan font-display font-bold text-xl uppercase italic">
                            <Terminal size={24} />
                            <span>SISTEMA_V1.5</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-cyber-purple border border-cyber-purple/30 rounded">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-6 pt-10">
                        <button onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }} className={`p-8 border text-left font-mono text-lg ${activeTab === 'projects' ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5' : 'border-cyber-dark text-gray-500'}`}>
                            {">"} GESTIÓN_PROYECTOS
                        </button>
                        <button onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} className={`p-8 border text-left font-mono text-lg ${activeTab === 'profile' ? 'border-cyber-purple text-cyber-purple bg-cyber-purple/5' : 'border-cyber-dark text-gray-500'}`}>
                            {">"} MI_PERFIL_GLOBAL
                        </button>
                        <hr className="border-cyber-dark my-6" />
                        <button onClick={handleLogout} className="p-8 border border-red-500/30 text-red-500 text-left font-mono text-lg">
                            [ LOGOUT_DEL_SISTEMA ]
                        </button>
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto pt-24 sm:pt-32 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-32">
                {/* SIDEBAR - DESKTOP ONLY */}
                <aside className="hidden lg:block space-y-4">
                    <div className="sticky top-32">
                        <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center justify-between p-6 border font-mono text-sm tracking-widest transition-all ${activeTab === 'projects' ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_20px_rgba(0,243,255,0.1)]' : 'bg-transparent border-cyber-dark text-gray-500 hover:bg-cyber-dark/30'}`}>
                            <div className="flex items-center gap-3"><Layers size={20} /> GESTIÓN_PROYECTOS</div>
                        </button>
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center justify-between p-6 border font-mono text-sm tracking-widest mt-4 transition-all ${activeTab === 'profile' ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple shadow-[0_0_20px_rgba(188,19,254,0.1)]' : 'bg-transparent border-cyber-dark text-gray-500 hover:bg-cyber-dark/30'}`}>
                            <div className="flex items-center gap-3"><User size={20} /> MI_PERFIL_GLOBAL</div>
                        </button>

                        <div className="mt-16 p-8 border border-cyber-dark/30 bg-cyber-dark/5 rounded-sm">
                            <p className="text-xs text-gray-600 font-mono uppercase leading-relaxed font-bold tracking-wider">
                                {">"}_ CONSOLA_ESTADO:<br />
                                <span className="text-cyber-green">SEGURIDAD_ACTIVA</span><br />
                                <span className="text-cyber-cyan">MODO_EDICIÓN_VIVO</span>
                            </p>
                        </div>
                    </div>
                </aside>

                <div className="lg:col-span-3">
                    {/* SECCIÓN: LISTADO DE PROYECTOS */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:row sm:justify-between sm:items-center gap-4">
                                <SectionHeader title="Portafolio_Técnico" subtitle="Capa de Persistencia: Proyectos" />
                                <button onClick={() => { setEditingProject(null); setShowProjectModal(true); }} className="w-full sm:w-auto bg-cyber-cyan text-black px-8 py-3 font-mono text-sm font-bold flex items-center justify-center gap-3 hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                                    <Plus size={20} /> NUEVO_PROYECTO
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {projects.map(p => (
                                    <div key={p.id} className="group relative bg-cyber-panel/20 border border-cyber-dark hover:border-cyber-cyan/50 transition-all duration-300">
                                        <div className="h-40 overflow-hidden bg-black relative">
                                            {p.images?.[0] ?
                                                <img src={p.images[0].url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" /> :
                                                <div className="w-full h-full flex items-center justify-center bg-cyber-dark/10"><Layers size={32} className="text-gray-800" /></div>
                                            }
                                            <div className="absolute top-2 right-2 bg-cyber-black/80 px-2 py-0.5 text-[9px] font-mono text-cyber-cyan border border-cyber-cyan/30">
                                                {p.category}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            <h4 className="font-display font-bold text-lg lg:text-xl text-white group-hover:text-cyber-cyan transition-colors truncate">{p.title}</h4>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditingProject(p); setShowProjectModal(true); }} className="flex-1 py-3 bg-cyber-cyan/5 border border-cyber-cyan/20 text-cyber-cyan text-xs lg:text-sm font-mono uppercase font-bold hover:bg-cyber-cyan hover:text-black transition-all">
                                                    EDITAR
                                                </button>
                                                <button onClick={() => handleDeleteProject(p.id)} className="p-3 border border-red-500/20 text-red-500/50 hover:text-red-500 hover:border-red-500 transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN: EDICIÓN DE PERFIL Y SKILLS */}
                    {activeTab === 'profile' && profile && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <form onSubmit={saveProfile} className="space-y-8">
                                <section className="space-y-6 bg-cyber-panel/10 p-4 sm:p-8 border border-cyber-dark">
                                    <SectionHeader title="Identidad_Global" subtitle="Configuración de cabecera y visión" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormField label="Nombre_Completo" name="name" defaultValue={profile.name} />
                                        <FormField label="Rol_Profesional" name="role" defaultValue={profile.role} />
                                        <div className="sm:col-span-2">
                                            <FormField label="Manifiesto_Hack" name="manifesto" defaultValue={profile.manifesto} />
                                        </div>
                                        <FormField label="Ubicación_Base" name="location" defaultValue={profile.location} />
                                        <FormField label="Estado_Actual" name="status" defaultValue={profile.status} />
                                        <div className="sm:col-span-2">
                                            <FormField label="Avatar_Link" name="profileImage" defaultValue={profile.profileImage} />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button className="w-full sm:w-auto bg-cyber-purple text-white px-8 py-3 font-mono font-bold text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(188,19,254,0.3)]">
                                            <Save size={18} className="inline mr-2" /> SINCRONIZAR_PERFIL
                                        </button>
                                    </div>
                                </section>

                                <section className="space-y-6 bg-cyber-panel/10 p-4 sm:p-8 border border-cyber-dark">
                                    <SectionHeader title="Sobre_Mí" subtitle="Contenido narrativo del portafolio" />
                                    <div className="space-y-4">
                                        <FormField label="Título_Sección" name="aboutTitle" defaultValue={profile.aboutTitle} />
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono text-cyber-purple uppercase ml-1 tracking-tighter">Descripción_Perfil (Extensa)</label>
                                            <textarea name="aboutDescription" defaultValue={profile.aboutDescription} rows={8} className="w-full bg-black border border-cyber-dark p-4 text-sm text-gray-300 focus:border-cyber-purple outline-none font-mono leading-relaxed"></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField label="Nivel_Inglés" name="englishLevel" defaultValue={profile.englishLevel} />
                                            <FormField label="Estudiando_Ahora" name="currentlyLearning" defaultValue={profile.currentlyLearning} />
                                        </div>
                                    </div>
                                </section>
                            </form>

                            {/* LISTADO DE HABILIDADES TÉCNICAS */}
                            <section className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-cyber-purple pb-4">
                                    <div className="flex items-center gap-3">
                                        <Book className="text-cyber-purple" />
                                        <h3 className="text-xl font-display font-bold text-white uppercase italic tracking-tighter">Hoja_de_Ruta_Taller</h3>
                                    </div>
                                    <button onClick={() => { setEditingTool(null); setShowToolModal(true); }} className="w-full sm:w-auto bg-cyber-purple text-white px-6 py-3 sm:py-2 font-mono text-xs font-bold hover:bg-white hover:text-black transition-all">
                                        <Plus size={16} className="inline mr-2" /> AGREGAR_SKILL
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tools.map(t => (
                                        <CyberCard key={t.id} className="!p-5 border-l-4 border-l-cyber-purple bg-cyber-panel/10 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg tracking-tighter uppercase">{t.name}</h4>
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase">{t.category}</span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingTool(t); setShowToolModal(true); }} className="text-gray-500 hover:text-cyber-cyan"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteTool(t.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={16} className={t.status === 'MASTERED' ? 'text-cyber-green' : 'text-gray-600'} />
                                                    <span className={`text-xs font-mono uppercase font-bold tracking-wider ${t.status === 'MASTERED' ? 'text-cyber-green' : 'text-gray-500'}`}>
                                                        STATUS: {t.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </CyberCard>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL: EDICIÓN DE PROYECTOS */}
            {showProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/98 backdrop-blur-xl">
                    <CyberCard className="w-full max-w-2xl max-h-[90vh] overflow-y-scroll border-2 border-cyber-cyan/50 ring-4 ring-cyber-cyan/5 scrollbar-hide">
                        <div className="flex justify-between items-center mb-10 sticky top-0 bg-cyber-panel/90 backdrop-blur-md z-10 p-2 md:p-0">
                            <h2 className="text-xl md:text-2xl font-display font-black text-white italic uppercase tracking-tighter">
                                {editingProject ? 'ACTUALIZAR_REGISTRO' : 'INICIAR_PROYECTO'}
                            </h2>
                            <button onClick={() => setShowProjectModal(false)} className="text-cyber-cyan hover:text-white transition-colors p-2"><X size={28} /></button>
                        </div>
                        <form onSubmit={saveProject} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Título_Proyecto" name="title" defaultValue={editingProject?.title} required />
                                <FormField label="CATEGORY" name="category" defaultValue={editingProject?.category} placeholder="BACKEND / JAVA / SPRING BOOT" required />
                            </div>
                            <FormTextarea label="Lógica_Descripción" name="description" defaultValue={editingProject?.description} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormTextarea label="Módulo_Problema" name="problem" defaultValue={editingProject?.problem} rows={3} />
                                <FormTextarea label="Módulo_Aprendizaje" name="learning" defaultValue={editingProject?.learning} rows={3} />
                            </div>
                            <FormTextarea label="Features_Lista (Separar por línea)" name="features" defaultValue={editingProject?.features?.join('\n')} />
                            <FormField label="Stack_Tecnológico (Separar por comas)" name="stack" defaultValue={editingProject?.stack?.join(', ')} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Repositorio_GitHub" name="githubUrl" defaultValue={editingProject?.githubUrl} />
                                <FormField label="Enlace_Despliegue" name="liveUrl" defaultValue={editingProject?.demoUrl || editingProject?.liveUrl} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="URL_Imagen_1 (Principal)" name="imageUrl1" defaultValue={editingProject?.images?.[0]?.url || editingProject?.imageUrl} />
                                <FormField label="URL_Imagen_2" name="imageUrl2" defaultValue={editingProject?.images?.[1]?.url} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="URL_Imagen_3" name="imageUrl3" defaultValue={editingProject?.images?.[2]?.url} />
                                <FormField label="URL_Imagen_4" name="imageUrl4" defaultValue={editingProject?.images?.[3]?.url} />
                            </div>
                            <FormField label="Versión" name="version" defaultValue={editingProject?.version || '1.1.0'} placeholder="1.1.0" />
                            <button disabled={loading} className="w-full bg-cyber-cyan text-black font-black p-4 uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                                {loading ? 'TRANSFIRIENDO...' : 'VOLCAR_EN_EL_SISTEMA'}
                            </button>
                        </form>
                    </CyberCard>
                </div>
            )}

            {/* MODAL: EDICIÓN DE HABILIDADES */}
            {showToolModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-lg">
                    <CyberCard className="w-full max-w-sm border-2 border-cyber-purple/50">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-display font-bold text-cyber-purple uppercase italic">Config_Skill</h2>
                            <button onClick={() => setShowToolModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={saveTool} className="space-y-5">
                            <FormField label="Nombre" name="name" defaultValue={editingTool?.name} required />
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono text-cyber-cyan uppercase ml-1 tracking-tighter">Categoría</label>
                                <select name="category" defaultValue={editingTool?.category || 'LENGUAJES & FRONTEND'} className="w-full bg-black border border-cyber-dark p-3 text-xs text-cyber-cyan outline-none font-mono">
                                    <option value="LENGUAJES & FRONTEND">LENGUAJES & FRONTEND</option>
                                    <option value="BACKEND FRAMEWORKS">BACKEND FRAMEWORKS</option>
                                    <option value="DATOS & PERSISTENCIA">DATOS & PERSISTENCIA</option>
                                    <option value="HERRAMIENTAS & CONCEPTOS">HERRAMIENTAS & CONCEPTOS</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase">Estado_De_Dominio</label>
                                <select name="status" defaultValue={editingTool?.status || 'LEARNING'} className="w-full bg-black border border-cyber-dark p-4 text-sm text-cyber-purple outline-none font-mono">
                                    <option value="LEARNING">APRENDIENDO [64%]</option>
                                    <option value="BASIC">CONOCIMIENTO_BÁSICO</option>
                                    <option value="INTERMEDIATE">NIVEL_INTERMEDIO</option>
                                    <option value="MASTERED">DOMINIO_TOTAL [HACKED]</option>
                                </select>
                            </div>
                            <button disabled={loading} className="w-full bg-cyber-purple text-white font-bold p-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                [ ACTUALIZAR_MATRIZ ]
                            </button>
                        </form>
                    </CyberCard>
                </div>
            )}

            {/* COMPONENTES DE NOTIFICACIÓN Y CONFIRMACIÓN */}
            {toast && (
                <CyberToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {confirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                    <CyberCard className="w-full max-w-md border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] !p-8">
                        <div className="flex items-center gap-3 text-red-500 mb-6 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                            <XCircle size={16} />
                            <span>PROTOCOLO_DE_PURGA_ACTIVO</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase italic tracking-tighter mb-10 leading-snug break-words">
                            {confirmModal.message}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="p-4 border border-cyber-dark text-gray-500 font-mono text-[10px] uppercase hover:bg-cyber-dark hover:text-white transition-all order-2 sm:order-1"
                            >
                                [ ABORTAR_ACCIÓN ]
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="p-4 bg-red-500 text-white font-bold font-mono text-[10px] uppercase hover:bg-white hover:text-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] order-1 sm:order-2"
                            >
                                CONFIRMAR_BORRADO
                            </button>
                        </div>
                    </CyberCard>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="border-l-4 border-cyber-cyan pl-4 py-2 my-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase italic tracking-tighter">{title}</h3>
        <p className="text-xs lg:text-sm font-mono text-gray-600 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
);

const FormField = ({ label, name, defaultValue, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-2">
        <label className="text-xs lg:text-sm font-mono text-cyber-cyan uppercase ml-1 tracking-widest font-bold">{label}</label>
        <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} className="w-full bg-black border border-cyber-dark p-4 text-sm lg:text-base text-gray-300 focus:border-cyber-cyan outline-none font-mono transition-colors" />
    </div>
);

const FormTextarea = ({ label, name, defaultValue, rows = 2, required = false }: any) => (
    <div className="space-y-2">
        <label className="text-xs lg:text-sm font-mono text-cyber-cyan uppercase ml-1 tracking-widest font-bold">{label}</label>
        <textarea name={name} defaultValue={defaultValue} rows={rows} required={required} className="w-full bg-black border border-cyber-dark p-4 text-sm lg:text-base text-gray-300 focus:border-cyber-cyan outline-none font-mono transition-colors leading-relaxed"></textarea>
    </div>
);

export default Admin;
