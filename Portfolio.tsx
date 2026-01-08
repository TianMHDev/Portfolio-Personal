import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Server,
  Database,
  Cpu,
  Code,
  Github,
  Linkedin,
  ChevronDown,
  ShieldCheck,
  Zap,
  Layers,
  User,
  BookOpen,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { HERO_DATA, ABOUT_DATA, TECH_STACK, PROJECTS, SKILLS_MINDSET } from './constants';
import { CyberCard, SectionTitle, Badge } from './components/CyberComponents';
import ProjectModal from './components/ProjectModal';
import { Project } from './types';
import { apiService } from './apiService';
import CyberToast from './components/CyberToast';

/**
 * COMPONENTE PRINCIPAL: PORTFOLIO
 * Este archivo gestiona la lógica de presentación del portafolio técnico.
 * Combina datos estáticos (locales) con datos dinámicos provenientes del backend.
 */
function Portfolio() {
  // --- ESTADOS LOCALES ---
  // Se inicializan con datos de constants.tsx para garantizar visibilidad inmediata (fallback)
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [hero, setHero] = useState(HERO_DATA);
  const [about, setAbout] = useState(ABOUT_DATA);
  const [dynamicStack, setDynamicStack] = useState(TECH_STACK);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // --- EFECTOS: Sincronización con Backend ---
  useEffect(() => {
    /** 
     * fetchData: Recupera toda la información del servidor Quarkus
     * Proyectos, Perfil y Herramientas (Skills).
     */
    const fetchData = async () => {
      try {
        const [backendProjects, backendProfile, backendTools] = await Promise.all([
          apiService.getProjects(),
          apiService.getProfile(),
          apiService.getLearningTools()
        ]);

        // Sincronizar sección Principal (Hero) y Sobre Mí
        if (backendProfile) {
          setHero({
            name: backendProfile.name,
            role: backendProfile.role,
            manifesto: backendProfile.manifesto,
            location: backendProfile.location,
            status: backendProfile.status
          });
          setAbout({
            title: backendProfile.aboutTitle,
            description: backendProfile.aboutDescription,
            englishLevel: backendProfile.englishLevel,
            profileImage: backendProfile.profileImage,
            currentlyLearning: backendProfile.currentlyLearning
          });
        }

        // Combinar proyectos estáticos con los guardados en Base de Datos
        setProjects(prev => {
          const combined = [...PROJECTS];
          backendProjects.forEach(bp => {
            if (!combined.some(p => p.title === bp.title)) {
              combined.push(bp);
            }
          });
          return combined;
        });

        // Sincronizar Tech Stack dinámicamente
        if (backendTools && backendTools.length > 0) {
          // Filtrar herramientas que ya no están en fase de aprendizaje puro
          const stackTools = backendTools.filter((t: any) => t.status !== 'LEARNING');

          setDynamicStack(prev => {
            const newStack = [...prev];
            stackTools.forEach((tool: any) => {
              // Buscar categoría por coincidencia de nombre
              const categoryIdx = newStack.findIndex(c =>
                c.title.toUpperCase().includes(tool.category?.toUpperCase() || "")
              );
              const targetIdx = categoryIdx !== -1 ? categoryIdx : 3; // Fallback a Herramientas Generales

              // Formatear etiqueta visual según el nivel de dominio registrado
              let levelSuffix = "";
              if (tool.status === 'BASIC') levelSuffix = " (Básico)";
              else if (tool.status === 'INTERMEDIATE') levelSuffix = " (Intermedio)";
              else if (tool.status === 'MASTERED') levelSuffix = " (Dominado)";

              const skillWithLevel = `${tool.name}${levelSuffix}`;

              if (!newStack[targetIdx].skills.includes(skillWithLevel)) {
                newStack[targetIdx].skills = [...newStack[targetIdx].skills, skillWithLevel];
              }
            });
            return newStack;
          });

          // Sincronizar sección "Aprendiendo Actualmente" con herramientas en estado LEARNING
          const learningTools = backendTools.filter((t: any) => t.status === 'LEARNING');
          if (learningTools.length > 0) {
            const learningNames = learningTools.map((t: any) => t.name).join(' ・ ');
            setAbout(prev => ({ ...prev, currentlyLearning: learningNames }));
            setHero(prev => ({ ...prev, status: `ACTUALMENTE: APRENDIENDO ${learningNames.toUpperCase()}` }));
          }
        }

      } catch (error) {
        console.error("LOG: Error sincronizando con el servidor. Usando datos locales.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => { };
  }, []);

  /** Función para navegación suave entre secciones */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text font-body selection:bg-cyber-cyan selection:text-black overflow-x-hidden relative text-left">
      {/* Fondo decorativo con patrón de rejilla */}
      <div className="fixed inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10 pointer-events-none z-0"></div>

      {/* CABECERA (Header) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-dark">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyber-cyan font-display font-bold text-xl tracking-tighter">
            <Terminal size={20} />
            <span>DEV_TIAN</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-gray-400">
            {['SOBRE MÍ', 'STACK', 'PROYECTOS', 'MENTALIDAD', 'CONTACTO'].map((item) => (
              <button key={item} onClick={() => {
                const id = item === 'SOBRE MÍ' ? 'about' : item === 'MENTALIDAD' ? 'mindset' : item === 'CONTACTO' ? 'contact' : item === 'PROYECTOS' ? 'projects' : 'stack';
                scrollToSection(id);
              }} className="hover:text-cyber-cyan transition-colors relative group">
                <span className="text-cyber-purple mr-1 opacity-0 group-hover:opacity-100 transition-opacity">./</span>
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-16">
        {/* SECCIÓN HERO (Presentación Principal) */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative">
          <div className="absolute top-1/4 left-10 w-24 h-24 border border-cyber-dark rounded-full flex items-center justify-center animate-pulse opacity-20 hidden md:flex">
            <Server size={32} className="text-cyber-purple" />
          </div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-cyber-dark rounded-full flex items-center justify-center animate-pulse opacity-20 hidden md:flex">
            <Database size={40} className="text-cyber-green" />
          </div>

          <div className="space-y-6 max-w-4xl">
            <p className="font-mono text-cyber-green text-sm md:text-base tracking-[0.2em] mb-4 uppercase">
              STATUS: <span className="text-cyber-cyan animate-pulse">{hero.status}</span>
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase">
              {hero.name}
              <span className="block text-3xl md:text-5xl text-cyber-cyan mt-4 font-bold drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                {hero.role}
              </span>
            </h1>
            <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-cyber-purple to-transparent my-6"></div>
            <p className="text-lg md:text-xl font-light text-gray-300 max-w-2xl mx-auto italic">"{hero.manifesto}"</p>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
              <button onClick={() => scrollToSection('projects')} className="px-8 py-4 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-display font-bold tracking-widest uppercase transition-all duration-300 clip-path-slant">PROYECTOS</button>
              <a href="/cv/cv-Sebastian-Marriagapdf.pdf" target="_blank" className="px-8 py-4 bg-cyber-purple/10 border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white font-display font-bold tracking-widest uppercase transition-all duration-300 clip-path-slant">DESCARGAR CV</a>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-4 bg-cyber-green/10 border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black font-display font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(10,255,96,0.1)] hover:shadow-[0_0_20px_rgba(10,255,96,0.3)]">CONTACTAR</button>
            </div>
          </div>
        </section>

        {/* SECCIÓN: SOBRE MÍ */}
        <section id="about" className="py-24 px-6 bg-cyber-dark/30">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="SOBRE_MÍ" subtitle="Quién soy y qué busco" />
              <div className="font-body text-lg text-gray-300 space-y-6 leading-relaxed">
                <p className="whitespace-pre-line">{about.description}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="p-3 border-l-2 border-cyber-purple bg-cyber-purple/5 flex-1">
                    <h4 className="font-display text-cyber-purple text-xs mb-1 uppercase tracking-widest">ENGLISH_LEVEL</h4>
                    <p className="font-mono text-[11px] text-gray-400 uppercase">{about.englishLevel}</p>
                  </div>
                  {about.currentlyLearning && about.currentlyLearning.length > 2 && (
                    <div className="p-3 border-l-2 border-cyber-cyan bg-cyber-cyan/5 flex-1 animate-pulse">
                      <h4 className="font-display text-cyber-cyan text-xs mb-1 uppercase tracking-widest">LEARNING_NOW</h4>
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="text-cyber-cyan animate-spin" />
                        <p className="font-mono text-[11px] text-gray-400 uppercase">{about.currentlyLearning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Carta de Perfil con Perfil de Usuario */}
            <div className="relative group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyber-cyan/5 rounded-full blur-[60px] animate-pulse"></div>
              <CyberCard className="bg-cyber-black/60 aspect-square flex flex-col items-center justify-center relative border-cyber-dark">
                <div className="z-10 text-center space-y-8">
                  <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56">
                    <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-tr from-cyber-purple via-cyber-cyan to-cyber-purple animate-spin-slow"></div>
                    <div className="absolute inset-1 rounded-full bg-cyber-black overflow-hidden border-2 border-cyber-black z-10">
                      {about.profileImage ? (
                        <img src={about.profileImage} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (<User size={100} className="text-gray-600" />)}
                    </div>
                    <div className="absolute bottom-4 right-4 w-5 h-5 bg-cyber-green rounded-full border-4 border-cyber-black shadow-[0_0_15px_#0aff60] z-20"></div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter uppercase">
                      {hero.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">{hero.name.split(' ')[1]}</span>
                    </h3>
                    <p className="text-gray-400 font-mono text-xs md:text-sm tracking-[0.4em] uppercase opacity-70">SOFTWARE DEVELOPER</p>
                  </div>
                </div>
              </CyberCard>
            </div>
          </div>
        </section>

        {/* SECCIÓN: STACK TECNOLÓGICO */}
        <section id="stack" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="TECH_ARSENAL" subtitle="Herramientas & Conocimientos" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dynamicStack.map((category, idx) => (
                <CyberCard key={idx} hoverEffect={true} className="h-full">
                  <div className="flex items-center gap-3 mb-6">
                    {idx === 0 && <Code className="text-cyber-cyan" />}
                    {idx === 1 && <Server className="text-cyber-purple" />}
                    {idx === 2 && <Database className="text-cyber-green" />}
                    {idx === 3 && <Layers className="text-white" />}
                    <h3 className="font-display font-bold text-lg text-white uppercase">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (<Badge key={skill}>{skill}</Badge>))}
                  </div>
                </CyberCard>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN: LABORATORIO (PROYECTOS) */}
        <section id="projects" className="py-24 px-6 bg-cyber-dark/30">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="LABORATORIO" subtitle="Proyectos & Aprendizaje Aplicado" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer relative bg-cyber-panel border border-cyber-dark hover:border-cyber-cyan/50 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden">
                  <div className="h-48 overflow-hidden bg-black relative">
                    <img src={project.images?.[0]?.url} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute top-0 right-0 bg-cyber-black/80 px-3 py-1 text-xs font-mono text-cyber-cyan border-bl border-l border-b border-cyber-cyan/30">
                      {project.version ? `v${project.version}` : `v1.0.0`}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.stack || []).slice(0, 3).map(tech => (<span key={tech} className="text-xs font-mono text-cyber-purple">#{tech}</span>))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan to-cyber-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN: MENTALIDAD / CULTURA */}
        <section id="mindset" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="CULTURA_DE_TRABAJO" subtitle="Cómo me ofrezco profesionalmente" />
            <div className="grid md:grid-cols-2 gap-8">
              {SKILLS_MINDSET.map((item, idx) => (
                <CyberCard key={idx} className="flex items-start gap-4 hover:bg-cyber-dark/50 transition-colors">
                  <div className="p-3 bg-cyber-black border border-cyber-dark rounded-full shrink-0">
                    {idx === 0 && <BookOpen className="text-yellow-400" size={20} />}
                    {idx === 1 && <ShieldCheck className="text-cyber-green" size={20} />}
                    {idx === 2 && <Zap className="text-cyber-cyan" size={20} />}
                    {idx === 3 && <Cpu className="text-cyber-purple" size={20} />}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white mb-2 italic uppercase">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </CyberCard>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN: CONTACTO */}
        <section id="contact" className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase">INICIAR CONEXIÓN</h2>
            <p className="text-gray-400 mb-12 max-w-lg mx-auto font-mono text-xs tracking-widest">{">>>"} LISTO PARA INTEGRARME A EQUIPOS DE ALTO RENDIMIENTO</p>
            <div className="max-w-2xl mx-auto">
              <CyberCard className="!p-8">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSendingMessage(true);
                  const target = e.target as any;
                  try {
                    await apiService.sendMessage({ name: target.name.value, email: target.email.value, message: target.message.value });
                    setToast({ message: '¡MENSAJE ENVIADO CON ÉXITO! TE RESPONDERÉ MUY PRONTO.', type: 'success' });
                    target.reset();
                  } catch (err) {
                    setToast({ message: 'ERROR_DE_SISTEMA: No se pudo transmitir.', type: 'error' });
                  } finally {
                    setSendingMessage(false);
                  }
                }} className="space-y-6 text-left">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField label="IDENTIDAD_USER" name="name" placeholder="Tu Nombre" required />
                    <FormField label="CANAL_COMUNICACIÓN" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-cyber-cyan uppercase ml-1 tracking-widest">MENSAJE_CIFRADO</label>
                    <textarea name="message" required rows={4} className="w-full bg-black border border-cyber-dark p-3 text-white focus:border-cyber-cyan outline-none font-mono" placeholder="¿Cómo podemos colaborar?"></textarea>
                  </div>
                  <button type="submit" disabled={sendingMessage} className="w-full bg-cyber-cyan text-black font-bold p-4 uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                    {sendingMessage ? 'ENVIANDO...' : 'ENVIAR_PAQUETE_DATOS'}
                  </button>
                </form>
              </CyberCard>
            </div>
          </div>
        </section>
      </main>

      {/* PIE DE PÁGINA (Footer) */}
      <footer className="py-16 border-t border-cyber-dark bg-black/60 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} TIAN_MARRIAGA | BACKEND_DEVELOPER | SYSTEM_V1.5.0
          </div>

          <div className="flex gap-12">
            <a href="https://github.com/TianMHDev" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyber-cyan transition-all font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 group">
              <Github size={24} className="group-hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]" />
              GITHUB
            </a>
            <a href="https://www.linkedin.com/in/sebastian-marriaga-hoyos/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyber-purple transition-all font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 group">
              <Linkedin size={24} className="group-hover:drop-shadow-[0_0_8px_rgba(188,19,254,0.5)]" />
              LINKEDIN
            </a>
          </div>
        </div>
      </footer>

      {/* MODALES Y COMPONENTES GLOBALES */}
      {selectedProject && (<ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />)}
      {toast && (<CyberToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
    </div>
  );
}

/** Componente auxiliar para campos de formulario */
const FormField = ({ label, name, placeholder, type = "text", required = false }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-mono text-cyber-cyan uppercase ml-1 tracking-tighter">{label}</label>
    <input name={name} type={type} placeholder={placeholder} required={required} className="w-full bg-black border border-cyber-dark p-3 text-sm text-gray-300 focus:border-cyber-cyan outline-none font-mono transition-colors" />
  </div>
);

export default Portfolio;