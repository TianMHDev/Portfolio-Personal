import React from 'react';

export interface TechItem {
  name: string;
  icon?: React.ReactNode;
}

export interface TechCategory {
  title: string;
  skills: string[];
}

export interface ProjectImage {
  url: string;
  caption: string;
  type: 'api' | 'architecture' | 'screenshot' | 'mockup';
}

export interface Project {
  id: string;
  title: string;
  category: string; // e.g., 'BACKEND / API', 'FULLSTACK'
  stack: string[];
  description: string;
  problem: string;
  learning: string;
  features: string[];
  githubUrl: string;
  liveUrl?: string; // URL del despliegue en vivo
  images: ProjectImage[];
  version?: string; // Versión del proyecto (ej: "1.0.0")
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}