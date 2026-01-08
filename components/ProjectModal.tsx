import React, { useState } from 'react';
import { Project } from '../types';
import { X, Github, ChevronLeft, ChevronRight, Terminal, Globe } from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    const images = project.images || [];
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = project.images || [];
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      <div
        className="absolute inset-0 bg-cyber-black/95 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-5xl bg-cyber-panel border border-cyber-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)] h-[90dvh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-sm flex flex-col md:flex-row">

        {/* Close Button - Optimized for touch */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2.5 bg-cyber-black/80 border border-cyber-purple/50 text-cyber-purple hover:text-white transition-all group"
          title="Cerrar Transmisión"
        >
          <X size={20} className="md:w-5 md:h-5" />
        </button>

        {/* Left Side: Visuals (Top on Mobile) */}
        <div className="w-full md:w-3/5 bg-black relative h-[25dvh] md:h-auto min-h-[180px] md:min-h-full border-b md:border-b-0 md:border-r border-cyber-dark flex-shrink-0 md:flex-shrink">
          {(project.images || []).length > 0 ? (
            <div className="relative h-full flex items-center justify-center bg-cyber-dark/50 overflow-hidden group">
              <img
                src={project.images[currentImageIndex].url}
                alt={project.images[currentImageIndex].caption}
                className="w-full h-full object-contain p-4"
              />

              {/* Image Controls */}
              {(project.images || []).length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 p-1.5 bg-cyber-black/80 border border-cyber-cyan/30 text-cyber-cyan z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 p-1.5 bg-cyber-black/80 border border-cyber-cyan/30 text-cyber-cyan z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/90 px-4 py-1.5 border-t border-cyber-cyan/30 flex justify-between items-center text-[9px] md:text-xs">
                <span className="text-cyber-cyan font-mono uppercase tracking-wider">
                  {project.images[currentImageIndex].type}
                </span>
                <span className="text-white font-body truncate ml-4">
                  {project.images[currentImageIndex].caption}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-cyber-dark text-4xl">
              <Terminal />
            </div>
          )}
        </div>

        {/* Right Side: Info (Bottom on Mobile) */}
        <div className="w-full md:w-2/5 flex flex-col min-h-0 flex-1 bg-cyber-panel overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 uppercase tracking-tighter leading-tight">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 text-cyber-purple font-mono text-[10px] md:text-xs tracking-widest">
                <span className="text-gray-400">CATEGORY //</span> {project.category}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(project.stack || []).map(tech => (
                <span key={tech} className="px-2 py-1 text-[10px] md:text-xs font-mono bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 font-bold">
                  {tech}
                </span>
              ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-cyber-green font-mono text-xs uppercase tracking-[0.2em] opacity-100 flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 bg-cyber-green rounded-full shadow-[0_0_5px_#0aff60]"></span>
                  Problem
                </h4>
                <p className="text-gray-200 font-body leading-relaxed text-sm md:text-base border-l-2 border-cyber-green/30 pl-4">
                  {project.problem}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-cyber-cyan font-mono text-xs uppercase tracking-[0.2em] opacity-100 flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full shadow-[0_0_5px_#00f3ff]"></span>
                  Solution
                </h4>
                <div className="text-gray-200 font-body leading-relaxed text-sm md:text-base space-y-4">
                  <p>{project.description}</p>
                  <p className="text-cyber-cyan font-medium italic bg-cyber-cyan/10 p-3 border-l-2 border-cyber-cyan/50 text-xs md:text-sm">
                    {project.learning}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pb-4">
                <h4 className="text-cyber-purple font-mono text-xs uppercase tracking-[0.2em] opacity-100 flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full shadow-[0_0_5px_#bc13fe]"></span>
                  Features
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {(project.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs md:text-sm text-gray-300">
                      <span className="mr-2 text-cyber-purple font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Footer: Action Buttons */}
          <div className="flex-shrink-0 p-4 md:p-6 bg-cyber-black/90 border-t border-cyber-dark flex flex-col gap-3 z-20 pb-8 md:pb-6">
            <div className="flex row gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-3 md:py-4 bg-cyber-purple/20 border border-cyber-purple/50 text-white hover:bg-cyber-purple hover:shadow-[0_0_15px_rgba(188,19,254,0.4)] text-xs md:text-sm font-display font-bold tracking-widest uppercase transition-all"
              >
                <Github className="mr-2" size={18} />
                CÓDIGO
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-3 md:py-4 bg-cyber-cyan/20 border border-cyber-cyan/50 text-white hover:bg-cyber-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] text-xs md:text-sm font-display font-bold tracking-widest uppercase transition-all"
                >
                  <Globe className="mr-2" size={18} />
                  PROYECTO
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;