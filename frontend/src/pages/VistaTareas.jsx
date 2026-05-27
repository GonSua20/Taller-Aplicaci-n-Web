//Importamos libreria de useState y useEffect para manejar el estado y los efectos secundarios en el componente.
import React, { useState, useEffect } from 'react';
//Importamos clienteAxios para hacer las peticiones HTTP a la API.
import clienteAxios from '../api/axios';
//Importamos los iconos de lucide-react para usarlos en la interfaz.
import { ClipboardList, Edit2, Trash2 } from 'lucide-react';

//Componente principal para la vista de tareas.
export default function VistaTareas() {
  // Estado para almacenar la lista de tareas y usuarios obtenida de la API.
  const [tareas, setTareas] = useState([]);
  // Estado para almacenar la lista de usuarios obtenida de la API, necesario para mostrar el nombre del usuario asignado a cada tarea.
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para el formulario unificado
  const [formulario, setFormulario] = useState({
    // El formulario tiene un id_task para saber si estamos editando (si tiene valor) o creando (si es null).
    id_task: null, title: '', description: '', id_user: '', status: 'Pendiente'
  });

  // Cargar tareas y usuarios al montar el componente
  useEffect(() => {
    // Al cargar el componente, se llama a la función cargarDatos para obtener tanto las tareas como los usuarios desde la API.
    cargarDatos();
  }, []);

  //Función para cargar tanto las tareas como los usuarios desde la API. Se hacen dos peticiones GET en paralelo utilizando Promise.all para optimizar la carga de datos.
  const cargarDatos = async () => {
    // Se utiliza un bloque try-catch para manejar posibles errores en las peticiones.
    try {
      // Se hacen dos peticiones GET en paralelo: una para obtener las tareas y otra para obtener los usuarios. Promise.all espera a que ambas promesas se resuelvan antes de continuar.
      const [resTareas, resUsuarios] = await Promise.all([
        // Petición GET para obtener las tareas desde la ruta '/tasks' de la API utilizando clienteAxios.
        clienteAxios.get('/tasks'),
        // Petición GET para obtener los usuarios desde la ruta '/users' de la API utilizando clienteAxios.
        clienteAxios.get('/users')
      ]);
      // Si ambas peticiones son exitosas, se actualizan los estados 'tareas' y 'usuarios' con los datos obtenidos de las respuestas.
      setTareas(resTareas.data);
      // Actualizamos el estado de usuarios con los datos obtenidos de la respuesta.
      setUsuarios(resUsuarios.data);
    } 
    // Si ocurre un error durante alguna de las peticiones, se captura y se muestra un mensaje de error en la consola.
    catch (error) { console.error("Error cargando datos", error); }
  };

  //Función para guardar una tarea, ya sea creando una nueva (POST) o actualizando una existente (PUT) dependiendo de si el formulario tiene un id_task. 
  const guardarTarea = async () => {
    // Validación simple para asegurarse de que los campos de título y usuario no estén vacíos antes de enviar la petición.
    if(!formulario.title || !formulario.id_user) return alert("Título y Usuario obligatorios");
    // Se utiliza un bloque try-catch para manejar posibles errores en la petición.
    try {
      // Si el formulario tiene un id_task, significa que estamos editando una tarea existente, por lo que se hace una petición PUT a la ruta correspondiente. Si no tiene id_task, se crea una nueva tarea con una petición POST.
      if (formulario.id_task) {
        // Actualizar (PUT)
        await clienteAxios.put(`/tasks/${formulario.id_task}`, formulario);
        // Actualizamos la tabla localmente
        setTareas(tareas.map(t => t.id_task === formulario.id_task ? formulario : t));
        // Si hay ID, es una actualización (PUT)
      } else {
        // Crear (POST)
        const res = await clienteAxios.post('/tasks', formulario);
        // Agregamos la nueva tarea a la tabla localmente
        setTareas([...tareas, res.data]);
      }
      // Limpiamos el formulario después de guardar
      setFormulario({ id_task: null, title: '', description: '', id_user: '', status: 'Pendiente' });
      // Si ocurre un error durante la petición, se captura y se muestra un mensaje de error en la consola.
    } catch (error) { console.error("Error al guardar tarea", error); }
  };

  //Función para preparar la edición de una tarea. Al hacer clic en el botón de editar, se cargan los datos de la tarea seleccionada en el formulario para que puedan ser modificados.
  const prepararEdicion = (tarea) => {
    // Al dar clic en editar, cargamos los datos de la fila en el formulario
    setFormulario({ ...tarea, status: tarea.status || 'Pendiente' });
  };

  //Función para eliminar una tarea. Al hacer clic en el botón de eliminar, se muestra una confirmación y si el usuario confirma, se hace una petición DELETE a la API para eliminar la tarea seleccionada.
  const eliminarTarea = async (id_task) => {
    // Se muestra una confirmación antes de eliminar la tarea. Si el usuario cancela, la función retorna sin hacer nada.
    if(!window.confirm("¿Seguro de eliminar esta tarea?")) return;
    // Se utiliza un bloque try-catch para manejar posibles errores en la petición.
    try {
      // Se hace la petición DELETE a la ruta correspondiente de la API utilizando clienteAxios. Si la petición es exitosa, se actualiza el estado 'tareas' filtrando la tarea eliminada para actualizar la tabla localmente.
      await clienteAxios.delete(`/tasks/${id_task}`);
      // Si la petición es exitosa, se actualiza el estado 'tareas' filtrando la tarea eliminada para que ya no aparezca en la tabla.
      setTareas(tareas.filter(t => t.id_task !== id_task));
      // Si ocurre un error durante la petición, se captura y se muestra un mensaje de error en la consola.
    } catch (error) { console.error("Error al eliminar", error); }
  };

  // Función para asignar una clase de badge diferente a cada usuario basado en su ID, para darle un estilo visual distintivo en la tabla.
  const getBadgeClass = (id) => {
    // Se define un array de clases de badge disponibles. La función retorna una clase basada en el ID del usuario utilizando el operador módulo para ciclar a través de las clases disponibles.
    const badges = ['badge-blue', 'badge-green', 'badge-yellow'];
    // Se utiliza el operador módulo para ciclar a través de las clases disponibles.
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
      <div className="inline-form" style={{ gridTemplateColumns: '2fr 2fr 2fr 2fr auto' }}>
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
        <div className="form-group">
          <label>Estado</label>
          <select className="form-control" 
            value={formulario.status} onChange={e => setFormulario({...formulario, status: e.target.value})}>
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
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
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map(tarea => {
            const user = usuarios.find(u => u.id_user === parseInt(tarea.id_user));
            const estadoActual = tarea.status || 'Pendiente';
            return (
              <tr key={tarea.id_task}>
                <td>{tarea.id_task}</td>
                <td>{tarea.title}</td>
                <td>{tarea.description}</td>
                <td>
                  {user ? <span className={`badge ${getBadgeClass(user.id_user)}`}>{user.name}</span> : 'Sin asignar'}
                </td>

                <td>
                  <span className={`badge ${estadoActual === 'Completada' ? 'badge-green' : 'badge-yellow'}`}>
                    {estadoActual}
                  </span>
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