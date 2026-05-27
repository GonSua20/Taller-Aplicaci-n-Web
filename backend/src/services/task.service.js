//Se importa el modelo de la tabla tasks
const { models } = require("../libs/sequelize");

class TaskService {
  //Esto hace que se traiga todas las tareas de la base de datos
  async findAll() {
    return await models.Task.findAll();
  }
  //Esto hace que se traiga una tarea por su id
  async findById(id) {
    //Const es una variable que no se puede modificar
    //await hace que espere a que la funcion se ejecute para continuar con el codigo
    const task = await models.Task.findByPk(id);
    if (!task) {
      throw new Error("Tarea no encontrada");
    }
    return task;
  }
  //Esto hace que se cree una tarea
  async create(data) {
    //Esto hace que se cree una tarea
    return {
      message: "Tarea creada exitosamente",
      data: await models.Task.create(data),
    };
  }
  //Esto hace que se actualice una tarea
  async update(id, data) {
    return {
      message: "Tarea actualizada exitosamente",
      data: await models.Task.update(data, { where: { id_task: id } }),
    };
  }
  //Esto hace que se elimine una tarea
  async delete(id) {
    return {
      message: "Tarea eliminada exitosamente",
      data: await models.Task.destroy({ where: { id_task: id } }),
    };
  }
}

module.exports = TaskService;