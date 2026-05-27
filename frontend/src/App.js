import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { User, ClipboardList, Menu } from 'lucide-react';
import VistaUsuarios from './pages/VistaUsuarios';
import VistaTareas from './pages/VistaTareas';

// Componente auxiliar para cambiar el título dinámicamente según la URL
const DynamicHeader = () => {
  const location = useLocation();
  const titulo = location.pathname === '/tareas' ? 'Gestión de Tareas' : 'Gestión de Usuarios';
  return <h2>{titulo}</h2>;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* SIDEBAR LATERAL */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon"><ClipboardList size={20} color="white" /></div>
            <div className="brand-text">
              <h1>Gestor de Tareas</h1>
              <p>Sistema básico</p>
            </div>
          </div>
          
          <nav>
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <User size={18} /> Usuarios
            </NavLink>
            <NavLink to="/tareas" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <ClipboardList size={18} /> Tareas
            </NavLink>
          </nav>
          
          <div className="sidebar-footer">© 2026 Gestor de Tareas</div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="main-content">
          <header className="topbar">
            <Menu size={24} color="#888" style={{cursor: 'pointer'}} />
            <DynamicHeader />
          </header>

          <div className="content-area">
            {/* AQUÍ SE INYECTAN LAS VISTAS DEPENDIENDO DE LA URL */}
            <Routes>
              <Route path="/" element={<Navigate to="/usuarios" replace />} />
              <Route path="/usuarios" element={<VistaUsuarios />} />
              <Route path="/tareas" element={<VistaTareas />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}