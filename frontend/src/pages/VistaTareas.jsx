import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';
import { ClipboardList, Edit2, Trash2 } from 'lucide-react';

export default function VistaTareas() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para el formulario unificado
  const [formulario, setFormulario] = useState({
    id_task: null, title: '', description: '', id_user: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- OBTENER (READ) ---
  const cargarDatos = async () => {
    try {
      const [resTareas, resUsuarios] = await Promise.all([
        clienteAxios.get('/tasks'),
        clienteAxios.get('/users')
      ]);
      setTareas(resTareas.data);
      setUsuarios(resUsuarios.data);
    } catch (error) { console.error("Error cargando datos", error); }
  };

  // --- AGREGAR y EDITAR (CREATE / UPDATE) ---
  const guardarTarea = async () => {
    if(!formulario.title || !formulario.id_user) return alert("Título y Usuario obligatorios");
    
    try {
      if (formulario.id_task) {
        // Actualizar (PUT)
        await clienteAxios.put(`/tasks/${formulario.id_task}`, formulario);
        setTareas(tareas.map(t => t.id_task === formulario.id_task ? formulario : t));
      } else {
        // Crear (POST)
        const res = await clienteAxios.post('/tasks', formulario);
        setTareas([...tareas, res.data]);
      }
      setFormulario({ id_task: null, title: '', description: '', id_user: '' });
    } catch (error) { console.error("Error al guardar tarea", error); }
  };

  // --- PREPARAR EDICIÓN ---
  const prepararEdicion = (tarea) => {
    setFormulario(tarea);
  };

  // --- ELIMINAR (DELETE) ---
  const eliminarTarea = async (id_task) => {
    if(!window.confirm("¿Seguro de eliminar esta tarea?")) return;
    try {
      await clienteAxios.delete(`/tasks/${id_task}`);
      setTareas(tareas.filter(t => t.id_task !== id_task));
    } catch (error) { console.error("Error al eliminar", error); }
  };

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
      </div>

      {/* FORMULARIO INLINE */}
      <div className="inline-form">
        <div className="form-group">
          <label>Título</label>
          <input type="text" className="form-control" placeholder="Ej. Estudiar React"
            value={formulario.title} onChange={e => setFormulario({...formulario, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <input type="text" className="form-control" placeholder="Descripción..."
            value={formulario.description} onChange={e => setFormulario({...formulario, description: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Usuario</label>
          <select className="form-control" 
            value={formulario.id_user} onChange={e => setFormulario({...formulario, id_user: e.target.value})}>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(u => (
              <option key={u.id_user} value={u.id_user}>{u.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" style={{height: '38px'}} onClick={guardarTarea}>
          {formulario.id_task ? 'Actualizar' : 'Guardar'}
        </button>
      </div>

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
                    {/* Botón Editar conectado a la función */}
                    <button onClick={() => prepararEdicion(tarea)} className="btn btn-icon btn-edit"><Edit2 size={14}/></button>
                    <button onClick={() => eliminarTarea(tarea.id_task)} className="btn btn-icon btn-delete"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}