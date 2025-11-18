import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Heart,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Encuestas', path: '/student/surveys' },
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Usuarios', path: '/admin/users' },
      { name: 'Estadísticas', path: '/admin/dashboard' },
    ],
    resources: [
      { name: 'Documentación', path: '#', external: true },
      { name: 'API Reference', path: '#', external: true },
      { name: 'Guía de Uso', path: '#', external: true },
      { name: 'FAQ', path: '#', external: true },
    ],
    legal: [
      { name: 'Privacidad', path: '#' },
      { name: 'Términos', path: '#' },
      { name: 'Cookies', path: '#' },
      { name: 'Licencia', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Chatbots Survey</span>
                <p className="text-xs text-gray-400">Education System</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Sistema de encuestas sobre el uso de chatbots de IA en la educación de ingeniería de software.
              Recopilamos y analizamos datos para mejorar la experiencia educativa.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a>
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110"
                  aria-label={social.label}
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Producto
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Recursos
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a>
                    href={link.path}
                    target={link.external ? '_blank' : '_self'}
                    rel={link.external ? 'noopener noreferrer' : ''}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"

                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Chatbots Survey System. Todos los derechos reservados.
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>para la educación</span>
            </div>

            {/* Technology Stack */}
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <span>Powered by</span>
              <span className="text-blue-400 font-semibold">React</span>
              <span>+</span>
              <span className="text-green-400 font-semibold">Node.js</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Version 1.0.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Last updated: {new Date().toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Estado del sistema
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Reportar un problema
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}