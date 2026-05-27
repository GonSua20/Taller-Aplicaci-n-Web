import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';
import { ClipboardList, Plus, Edit2, Trash2 } from 'lucide-react';

export default function VistaTareas() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Para poblar el select
  
  const [nuevaTarea, setNuevaTarea] = useState({
    title: '', description: '', id_user: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resTareas, resUsuarios] = await Promise.all([
        clienteAxios.get('/tasks'),
        clienteAxios.get('/users')
      ]);
      setTareas(resTareas.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  const handleGuardar = async () => {
    if(!nuevaTarea.title || !nuevaTarea.id_user) {
        return alert("El título y el usuario son obligatorios");
    }
    try {
      const res = await clienteAxios.post('/tasks', nuevaTarea);
      setTareas([...tareas, res.data]); // Actualiza la UI
      setNuevaTarea({ title: '', description: '', id_user: '' }); // Limpia el formulario
    } catch (error) {
      console.error("Error al guardar tarea", error);
    }
  };

  const eliminarTarea = async (id_task) => {
    if(!window.confirm("¿Estás seguro de eliminar esta tarea?")) return;
    try {
      await clienteAxios.delete(`/tasks/${id_task}`);
      setTareas(tareas.filter(t => t.id_task !== id_task));
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  // Función visual para darle un color distinto a la etiqueta de cada usuario
  const getBadgeClass = (id) => {
    const badges = ['badge-blue', 'badge-green', 'badge-yellow'];
    return badges[(id || 0) % badges.length];
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3><ClipboardList size={20} /> Tareas</h3>
          <p>Administra las tareas del sistema.</p>
        </div>
        <button className="btn btn-primary"><Plus size={16}/> Nueva Tarea</button>
      </div>

      {/* FORMULARIO INLINE */}
      <div className="inline-form">
        <div className="form-group">
          <label>Título</label>
          <input type="text" className="form-control" placeholder="Ej. Estudiar React"
            value={nuevaTarea.title} onChange={e => setNuevaTarea({...nuevaTarea, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input type="text" className="form-control" placeholder="Descripción de la tarea..."
            value={nuevaTarea.description} onChange={e => setNuevaTarea({...nuevaTarea, description: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Usuario Responsable</label>
          <select className="form-control" 
            value={nuevaTarea.id_user} onChange={e => setNuevaTarea({...nuevaTarea, id_user: e.target.value})}>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => (
              <option key={u.id_user} value={u.id_user}>{u.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" style={{height: '38px'}} onClick={handleGuardar}>Guardar</button>
      </div>

      {/* TABLA */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map(tarea => {
            // Buscamos el nombre del usuario comparando el id_user de la tarea con la lista de usuarios
            const user = usuarios.find(u => u.id_user === parseInt(tarea.id_user));
            return (
              <tr key={tarea.id_task}>
                <td>{tarea.id_task}</td>
                <td>{tarea.title}</td>
                <td>{tarea.description}</td>
                <td>
                  {user ? <span className={`badge ${getBadgeClass(user.id_user)}`}>{user.name}</span> : 'Sin asignar'}
                </td>
                <td>
                  <div className="actions">
                    <button className="btn btn-icon btn-edit"><Edit2 size={14}/></button>
                    <button onClick={() => eliminarTarea(tarea.id_task)} className="btn btn-icon btn-delete"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
          {tareas.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', color: '#888'}}>No hay tareas registradas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}