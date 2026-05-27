//Importación de la librería axios para realizar solicitudes HTTP
import axios from 'axios';

//Creación de una instancia de axios con una configuración base para las solicitudes a la API
const clienteAxios = axios.create({
  
  //Definimos la URL para las solicitudes a la API, en este caso, 
  // se asume que la API está corriendo en localhost en el puerto 3001
  baseURL: 'http://localhost:3001/api', 
  //Definimos los encabezados para las solicitudes, indicando que el contenido es JSON
  headers: {
 //El encabezado 'Content-Type' se establece en 'application/json' para indicar que el cuerpo de las solicitudes será en formato JSON
    'Content-Type': 'application/json'
  }
});

//Exportamos la instancia de axios para que pueda ser utilizada en otras partes de la aplicación
export default clienteAxios;