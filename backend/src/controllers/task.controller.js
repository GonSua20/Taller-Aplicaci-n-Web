//Se importa el servicio de tareas
const TaskService = require("../services/task.service");

//Se crea una instancia del servicio de tareas
const taskService = new TaskService();

//Se define la clase TaskController
class TaskController {
  //Esto hace que se traigan todas las tareas
  async findAll(req, res) {
    try {
      //Se ejecuta la funcion findAll del servicio de tareas  
      const tasks = await taskService.findAll();
      //Se retorna la respuesta en formato json
      return res.json(tasks);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se traiga una tarea por su id
  async findById(req, res) {
    try {
      //Se obtiene el id de la tarea
      const { id } = req.params;
      //Se trae la tarea por su id
      const task = await taskService.findById(id);
      //Se retorna la respuesta en formato json
      return res.json(task);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se cree una tarea
  async create(req, res) {
    try {
      //Se obtiene el body de la peticion
      const { body } = req;
      //Se crea la tarea
      const task = await taskService.create(body);
      //Se retorna la respuesta en formato json
      return res.json(task);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se actualice una tarea
  async update(req, res) {
    try {
      //Se obtiene el id de la tarea
      const { id } = req.params;
      //Se obtiene el body de la peticion
      const { body } = req;
      //Se actualiza la tarea
      const task = await taskService.update(id, body);
      //Se retorna la respuesta en formato json
      return res.json(task);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se elimine una tarea
  async delete(req, res) {
    try {
      //Se obtiene el id de la tarea
      const { id } = req.params;
      //Se elimina la tarea
      const task = await taskService.delete(id);
      //Se retorna la respuesta en formato json
      return res.json(task);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
}

//Se exporta la clase TaskController
module.exports = TaskController;