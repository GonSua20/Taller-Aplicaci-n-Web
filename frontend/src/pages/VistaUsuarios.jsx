import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';
import { User, Edit2, Trash2 } from 'lucide-react';

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para el formulario (con id_user para saber si editamos o creamos)
  const [formulario, setFormulario] = useState({
    id_user: null, name: '', email: ''
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // --- OBTENER (READ) ---
  const cargarUsuarios = async () => {
    try {
      const res = await clienteAxios.get('/users'); 
      setUsuarios(res.data);
    } catch (error) { console.error("Error al cargar usuarios", error); }
  };

  // --- AGREGAR y EDITAR (CREATE / UPDATE) ---
  const guardarUsuario = async () => {
    if(!formulario.name || !formulario.email) return alert("Llena todos los campos");

    try {
      if (formulario.id_user) {
        // Si hay ID, es una actualización (PUT)
        await clienteAxios.put(`/users/${formulario.id_user}`, formulario);
        // Actualizamos la tabla localmente
        setUsuarios(usuarios.map(u => u.id_user === formulario.id_user ? formulario : u));
      } else {
        // Si no hay ID, es uno nuevo (POST)
        const res = await clienteAxios.post('/users', formulario);
        setUsuarios([...usuarios, res.data]);
      }
      // Limpiamos el formulario después de guardar
      setFormulario({ id_user: null, name: '', email: '' });
    } catch (error) { console.error("Error al guardar", error); }
  };

  // --- PREPARAR EDICIÓN ---
  const prepararEdicion = (usuario) => {
    // Al dar clic en editar, cargamos los datos de la fila en el formulario
    setFormulario(usuario);
  };

  // --- ELIMINAR (DELETE) ---
  const eliminarUsuario = async (id_user) => {
    if(!window.confirm("¿Seguro de eliminar este usuario?")) return;
    try {
      await clienteAxios.delete(`/users/${id_user}`);
      setUsuarios(usuarios.filter(u => u.id_user !== id_user));
    } catch (error) { console.error("Error al eliminar", error); }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3><User size={20} /> Usuarios</h3>
          <p>Administra los usuarios del sistema.</p>
        </div>
      </div>

      {/* FORMULARIO INLINE PARA USUARIOS */}
      <div className="inline-form" style={{ gridTemplateColumns: '1fr 1fr auto auto' }}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" placeholder="Ej. Ana Martínez"
            value={formulario.name} onChange={e => setFormulario({...formulario, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" className="form-control" placeholder="ana@ejemplo.com"
            value={formulario.email} onChange={e => setFormulario({...formulario, email: e.target.value})} />
        </div>
        <button className="btn btn-primary" style={{height: '38px'}} onClick={guardarUsuario}>
          {formulario.id_user ? 'Actualizar' : 'Guardar Nuevo'}
        </button>
        {/* Botón para cancelar edición si hay un ID */}
        {formulario.id_user && (
          <button className="btn btn-delete" style={{height: '38px'}} onClick={() => setFormulario({id_user: null, name: '', email: ''})}>
            Cancelar
          </button>
        )}
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
                  {/* Botón Editar conectado a la función */}
                  <button onClick={() => prepararEdicion(usuario)} className="btn btn-icon btn-edit"><Edit2 size={14}/></button>
                  <button onClick={() => eliminarUsuario(usuario.id_user)} className="btn btn-icon btn-delete"><Trash2 size={14}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}