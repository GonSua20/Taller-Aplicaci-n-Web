import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';
import { User, Plus, Edit2, Trash2 } from 'lucide-react';

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await clienteAxios.get('/users'); 
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    }
  };

  const eliminarUsuario = async (id_user) => {
    if(!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await clienteAxios.delete(`/users/${id_user}`);
      setUsuarios(usuarios.filter(u => u.id_user !== id_user));
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3><User size={20} /> Usuarios</h3>
          <p>Administra los usuarios del sistema.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16}/> Nuevo Usuario</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id_user}>
              <td>{usuario.id_user}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-icon btn-edit"><Edit2 size={14}/></button>
                  <button onClick={() => eliminarUsuario(usuario.id_user)} className="btn btn-icon btn-delete"><Trash2 size={14}/></button>
                </div>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr><td colSpan="4" style={{textAlign: 'center', color: '#888'}}>No hay usuarios registrados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}