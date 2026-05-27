//Importamos libreria de useState y useEffect para manejar el estado y los efectos secundarios en el componente.
import React, { useState, useEffect } from 'react';
//Importamos clienteAxios para hacer las peticiones HTTP a la API.
import clienteAxios from '../api/axios';
//Importamos los iconos de lucide-react para usarlos en la interfaz.
import { User, Edit2, Trash2 } from 'lucide-react';

//Componente principal para la vista de usuarios.
export default function VistaUsuarios() {
  // Estado para almacenar la lista de usuarios obtenida de la API.
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para el formulario (con id_user para saber si editamos o creamos)
  const [formulario, setFormulario] = useState({
    // Inicialmente, el formulario está vacío y sin ID, lo que indica que se usará para crear un nuevo usuario.
    id_user: null, name: '', email: ''
  });

  // useEffect para cargar los usuarios al montar el componente.
  useEffect(() => {
    // Al cargar el componente, se llama a la función cargarUsuarios para obtener la lista de usuarios desde la API.
    cargarUsuarios();
  }, []);

  //Función para cargar los usuarios desde la API. Se hace una petición GET a '/users' y se actualiza el estado con la respuesta.
  const cargarUsuarios = async () => {
    // Se utiliza un bloque try-catch para manejar posibles errores en la petición.
    try {
      // Se hace la petición GET a la ruta '/users' de la API utilizando clienteAxios.
      const res = await clienteAxios.get('/users'); 
      // Si la petición es exitosa, se actualiza el estado 'usuarios' con los datos obtenidos de la respuesta.
      setUsuarios(res.data);
    } 
    // Si ocurre un error durante la petición, se captura y se muestra un mensaje de error en la consola.
    catch (error) { console.error("Error al cargar usuarios", error); }
  };

  //Función para guardar un usuario, ya sea creando uno nuevo (POST) o actualizando uno existente (PUT) dependiendo de si el formulario tiene un id_user.
  const guardarUsuario = async () => {
    // Validación simple para asegurarse de que los campos de nombre y correo no estén vacíos antes de enviar la petición.
    if(!formulario.name || !formulario.email) return alert("Llena todos los campos");

    //Validaciones de duplicados
    // Normalizamos el texto (quitamos espacios al inicio/fin y pasamos a minúsculas) para que "Nombre" y "nombre" se consideren iguales.
    const nombreNormalizado = formulario.name.trim().toLowerCase();
    const correoNormalizado = formulario.email.trim().toLowerCase();

    // Verificamos si existe otro usuario con el mismo nombre
    const nombreDuplicado = usuarios.some(
      u => u.name.trim().toLowerCase() === nombreNormalizado && u.id_user !== formulario.id_user
    );

    // Verificamos si existe otro usuario con el mismo correo
    const correoDuplicado = usuarios.some(
      u => u.email.trim().toLowerCase() === correoNormalizado && u.id_user !== formulario.id_user
    );

    // Si encontramos duplicados, detenemos la ejecución y avisamos
    if (nombreDuplicado) {
        return alert(`El nombre "${formulario.name}" ya está registrado. Por favor, usa otro.`);
    }

    if (correoDuplicado) {
        return alert(`El correo "${formulario.email}" ya está en uso. Por favor, ingresa uno diferente.`);
    }


    // Se utiliza un bloque try-catch para manejar posibles errores en la petición.
    try {
      // Si el formulario tiene un id_user, significa que estamos editando un usuario existente, por lo que se hace una petición PUT a la ruta correspondiente.
      if (formulario.id_user) {
        // Si hay ID, es una actualización (PATCH)
        await clienteAxios.patch(`/users/${formulario.id_user}`, formulario);
      } else {
        // Si no hay ID, es una creación (POST)
        await clienteAxios.post('/users', formulario);
      }

      cargarUsuarios(); // Recargamos la lista de usuarios para reflejar los cambios
      // Limpiamos el formulario después de guardar
      setFormulario({ id_user: null, name: '', email: '' });
    } 
    // Si ocurre un error durante la petición, se captura y se muestra un mensaje de error en la consola.
    catch (error) { console.error("Error al guardar", error); }
  };

  //Función para preparar la edición de un usuario. Al hacer clic en el botón de editar, se cargan los datos del usuario seleccionado en el formulario para que puedan ser modificados.
  const prepararEdicion = (usuario) => {
    // Al dar clic en editar, cargamos los datos de la fila en el formulario
    setFormulario(usuario);
  };

  //Función para eliminar un usuario. Al hacer clic en el botón de eliminar, se muestra una confirmación y si el usuario confirma, se hace una petición DELETE a la API para eliminar el usuario seleccionado.
  const eliminarUsuario = async (id_user) => {
    // Se muestra una confirmación antes de eliminar el usuario. Si el usuario cancela, la función retorna sin hacer nada.
    if(!window.confirm("¿Seguro de eliminar este usuario?")) return;
    // Se utiliza un bloque try-catch para manejar posibles errores en la petición.
    try {
      // Se hace la petición DELETE a la ruta correspondiente de la API utilizando clienteAxios.
      await clienteAxios.delete(`/users/${id_user}`);
      // Si la petición es exitosa, se actualiza el estado 'usuarios' filtrando el usuario eliminado para que ya no aparezca en la tabla.
      setUsuarios(usuarios.filter(u => u.id_user !== id_user));
    } 
    // Si ocurre un error durante la petición, se captura y se muestra un mensaje de error en la consola.
    catch (error) { console.error("Error al eliminar", error); }
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