// Importamos las dependencias necesarias para la aplicación, incluyendo React, componentes de react-router-dom para el enrutamiento, estilos CSS y los iconos de lucide-react. También importamos las vistas principales de usuarios y tareas.
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { User, ClipboardList, Menu } from 'lucide-react';
import VistaUsuarios from './pages/VistaUsuarios';
import VistaTareas from './pages/VistaTareas';

// Componente auxiliar para cambiar el título dinámicamente según la URL
const DynamicHeader = () => {
  // useLocation es un hook de react-router-dom que nos permite acceder a la ubicación actual (URL) dentro del componente. Esto es útil para determinar qué título mostrar en el encabezado según la ruta activa.
  const location = useLocation();
  // Se define una variable 'titulo' que se asigna un valor basado en la ruta actual. Si la ruta es '/tareas', el título será 'Gestión de Tareas'; de lo contrario, será 'Gestión de Usuarios'. Esto permite que el encabezado cambie dinámicamente según la sección de la aplicación que el usuario esté viendo.
  const titulo = location.pathname === '/tareas' ? 'Gestión de Tareas' : 'Gestión de Usuarios';
  // El componente retorna un elemento h2 que muestra el título dinámico basado en la ruta actual.
  return <h2>{titulo}</h2>;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        
        {/* Sidebar */}
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
          
          <div className="sidebar-footer">© Proyecto para taller</div>
        </aside>

        {/* Contenido principal */}
        <main className="main-content">
          <header className="topbar">
            <Menu size={24} color="#888" style={{cursor: 'pointer'}} />
            <DynamicHeader />
          </header>

          <div className="content-area">
            {/* Vistas principales */}
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