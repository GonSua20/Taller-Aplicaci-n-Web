

//Se inicializan los modelos para que sequelize los reconozca
const { User, UserSchema } = require("./user.model");
const { Task, TaskSchema } = require("./task.model");

//Esta funcion es la que se encarga de inicializar los modelos
function setupModels(sequelize) {
  //Se inicializan los modelos
  User.init(UserSchema, User.config(sequelize));
  Task.init(TaskSchema, Task.config(sequelize));

  //Asociaciones
  User.associate(sequelize.models);
  Task.associate(sequelize.models);
}

module.exports = setupModels;