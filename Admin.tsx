import React, { useState, useEffect } from 'react';
import { Terminal, Lock, LogOut, Plus, Trash2, Edit2, Book, Layers, Save, X, ExternalLink, User, CheckCircle2, Globe, XCircle } from 'lucide-react';
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
                formData.get('imageUrl3')
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
            progress: Number(formData.get('progress'))
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
                            <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2 ml-1">Terminal_ID</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-black border border-cyber-dark p-3 text-cyber-cyan focus:border-cyber-cyan outline-none font-mono" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2 ml-1">Código_Encriptado</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black border border-cyber-dark p-3 text-cyber-cyan focus:border-cyber-cyan outline-none font-mono" />
                        </div>
                        {error && <p className="text-red-500 font-mono text-[10px] border border-red-500/30 p-2 bg-red-500/10 italic text-center uppercase">{error}</p>}
                        <button disabled={loading} className="w-full bg-cyber-cyan text-black font-bold p-3 uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
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
            <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between mb-12 border-b border-cyber-dark pb-6 gap-6 text-center sm:text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 border border-cyber-cyan rounded-sm shrink-0">
                        <Terminal className="text-cyber-cyan animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter uppercase italic">PANEL_DE_CONTROL</h1>
                        <p className="text-[10px] text-cyber-green font-mono uppercase tracking-widest">STATUS: ADMIN_AUTORIZADO</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                    <a href="/" target="_blank" className="text-xs font-mono text-gray-400 hover:text-cyber-cyan flex items-center gap-1 transition-colors">
                        <ExternalLink size={14} /> VER_SITIO_REAL
                    </a>
                    <button onClick={handleLogout} className="px-4 py-1.5 border border-red-500/30 text-gray-500 hover:text-red-500 hover:border-red-500 transition-all font-mono text-xs rounded-sm">
                        <LogOut size={16} className="inline mr-2" /> [LOGOUT]
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* NAVEGACIÓN LATERAL / SUPERIOR EN MÓVIL */}
                <aside className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
                    <button onClick={() => setActiveTab('projects')} className={`flex-1 shrink-0 lg:w-full flex items-center justify-between p-4 border font-mono text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'projects' ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'bg-transparent border-cyber-dark text-gray-500 hover:bg-cyber-dark/30'}`}>
                        <div className="flex items-center gap-3"><Layers size={20} /> GESTIÓN_PROYECTOS</div>
                        {activeTab === 'projects' && <div className="hidden sm:block w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse"></div>}
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 shrink-0 lg:w-full flex items-center justify-between p-4 border font-mono text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple shadow-[0_0_15px_rgba(188,19,254,0.1)]' : 'bg-transparent border-cyber-dark text-gray-500 hover:bg-cyber-dark/30'}`}>
                        <div className="flex items-center gap-3"><User size={20} /> MI_PERFIL_GLOBAL</div>
                        {activeTab === 'profile' && <div className="hidden sm:block w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse"></div>}
                    </button>
                </aside>

                <div className="lg:col-span-3">
                    {/* SECCIÓN: LISTADO DE PROYECTOS */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:row sm:justify-between sm:items-center gap-4">
                                <SectionHeader title="Portafolio_Técnico" subtitle="Capa de Persistencia: Proyectos" />
                                <button onClick={() => { setEditingProject(null); setShowProjectModal(true); }} className="w-full sm:w-auto bg-cyber-cyan text-black px-6 py-2 font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-white transition-all transform hover:-translate-y-1">
                                    <Plus size={18} /> NUEVO_PROYECTO
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {projects.map(p => (
                                    <CyberCard key={p.id} className="!p-4 bg-cyber-panel/20 border-cyber-dark group hover:border-cyber-purple/50 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-black border border-cyber-dark overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                                                    {p.images?.[0] ? <img src={p.images[0].url} className="w-full h-full object-cover" /> : <Layers size={24} className="text-gray-800" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-white group-hover:text-cyber-cyan transition-colors">{p.title}</h4>
                                                    <div className="flex gap-3 text-[10px] font-mono uppercase text-gray-500 italic">
                                                        <span className="text-cyber-green">{p.category}</span>
                                                        <span className="text-cyber-purple">{(p.stack || []).join(' ・ ')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setEditingProject(p); setShowProjectModal(true); }} className="p-2 bg-cyber-dark/50 text-gray-400 hover:text-cyber-cyan border border-transparent hover:border-cyber-cyan/30 rounded-sm">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteProject(p.id)} className="p-2 bg-cyber-dark/50 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-500/30 rounded-sm">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </CyberCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN: EDICIÓN DE PERFIL Y SKILLS */}
                    {activeTab === 'profile' && profile && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <form onSubmit={saveProfile} className="space-y-8">
                                <section className="space-y-6 bg-cyber-panel/10 p-6 border border-cyber-dark">
                                    <SectionHeader title="Identidad_Global" subtitle="Configuración de cabecera y visión" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField label="Nombre_Completo" name="name" defaultValue={profile.name} />
                                        <FormField label="Rol_Profesional" name="role" defaultValue={profile.role} />
                                        <FormField label="Manifiesto_Hack" name="manifesto" defaultValue={profile.manifesto} />
                                        <FormField label="Ubicación_Base" name="location" defaultValue={profile.location} />
                                        <FormField label="Estado_Actual" name="status" defaultValue={profile.status} />
                                        <FormField label="Avatar_Link" name="profileImage" defaultValue={profile.profileImage} />
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button className="bg-cyber-purple text-white px-8 py-3 font-mono font-bold text-sm hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(188,19,254,0.3)]">
                                            <Save size={18} className="inline mr-2" /> SINCRONIZAR_PERFIL
                                        </button>
                                    </div>
                                </section>

                                <section className="space-y-6 bg-cyber-panel/10 p-6 border border-cyber-dark">
                                    <SectionHeader title="Sobre_Mí" subtitle="Contenido narrativo del portafolio" />
                                    <div className="space-y-4">
                                        <FormField label="Título_Sección" name="aboutTitle" defaultValue={profile.aboutTitle} />
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono text-cyber-purple uppercase ml-1 tracking-tighter">Descripción_Perfil (Extensa)</label>
                                            <textarea name="aboutDescription" defaultValue={profile.aboutDescription} rows={5} className="w-full bg-black border border-cyber-dark p-4 text-sm text-gray-300 focus:border-cyber-purple outline-none font-mono leading-relaxed"></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField label="Nivel_Inglés" name="englishLevel" defaultValue={profile.englishLevel} />
                                            <FormField label="Estudiando_Ahora" name="currentlyLearning" defaultValue={profile.currentlyLearning} />
                                        </div>
                                    </div>
                                </section>
                            </form>

                            {/* LISTADO DE HABILIDADES TÉCNICAS */}
                            <section className="space-y-6">
                                <div className="flex justify-between items-center border-b-2 border-cyber-purple pb-4">
                                    <div className="flex items-center gap-3">
                                        <Book className="text-cyber-purple" />
                                        <h3 className="text-xl font-display font-bold text-white uppercase italic tracking-tighter">Hoja_de_Ruta_Taller</h3>
                                    </div>
                                    <button onClick={() => { setEditingTool(null); setShowToolModal(true); }} className="bg-cyber-purple text-white px-6 py-2 font-mono text-xs font-bold hover:bg-white hover:text-black transition-all">
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
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                                                    <span>Progreso_Operativo</span>
                                                    <span>{t.progress}%</span>
                                                </div>
                                                <div className="h-1 bg-black w-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan" style={{ width: `${t.progress}%` }}></div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <CheckCircle2 size={14} className={t.status === 'MASTERED' ? 'text-cyber-green' : 'text-gray-600'} />
                                                    <span className={`text-[10px] font-mono uppercase font-bold ${t.status === 'MASTERED' ? 'text-cyber-green' : 'text-gray-600'}`}>[{t.status}]</span>
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
                            <div className="grid grid-cols-1 gap-6">
                                <FormField label="URL_Imagen_3" name="imageUrl3" defaultValue={editingProject?.images?.[2]?.url} />
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase">Estado</label>
                                    <select name="status" defaultValue={editingTool?.status || 'LEARNING'} className="w-full bg-black border border-cyber-dark p-3 text-xs text-cyber-purple outline-none">
                                        <option value="LEARNING">APRENDIENDO</option>
                                        <option value="INTERMEDIATE">INTERMEDIO</option>
                                        <option value="BASIC">BÁSICO</option>
                                        <option value="MASTERED">DOMINADO</option>
                                    </select>
                                </div>
                                <FormField label="Progreso_%" name="progress" type="number" defaultValue={editingTool?.progress || 0} />
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
    <div>
        <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tighter">{title}</h3>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{subtitle}</p>
    </div>
);

const FormField = ({ label, name, defaultValue, placeholder, type = "text", required = false }: any) => (
    <div className="space-y-1">
        <label className="text-[10px] font-mono text-cyber-cyan uppercase ml-1 tracking-tighter">{label}</label>
        <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} className="w-full bg-black border border-cyber-dark p-3 text-sm text-gray-300 focus:border-cyber-cyan outline-none font-mono transition-colors" />
    </div>
);

const FormTextarea = ({ label, name, defaultValue, rows = 2, required = false }: any) => (
    <div className="space-y-1">
        <label className="text-[10px] font-mono text-cyber-cyan uppercase ml-1 tracking-tighter">{label}</label>
        <textarea name={name} defaultValue={defaultValue} rows={rows} required={required} className="w-full bg-black border border-cyber-dark p-3 text-sm text-gray-300 focus:border-cyber-cyan outline-none font-mono transition-colors"></textarea>
    </div>
);

export default Admin;
