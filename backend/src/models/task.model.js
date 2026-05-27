//Se importa DataTypes y Model de la libreria sequelize 
const { DataTypes, Model } = require("sequelize");
//Se importa la tabla users para establecer la relación con la tabla tasks
const { USER_TABLE } = require("./user.model");

//Se define el nombre de la tabla
const TASK_TABLE = "tasks";

//Se define el esquema de la tabla tasks
const TaskSchema = {
  id_task: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  //Se define el tipo de dato para el titulo de la tarea
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  //Se define el tipo de dato para la descripción de la tarea
  description: {
    //El TEXT nos ayuda a guardar textos largos
    type: DataTypes.TEXT,
    allowNull: false,
  },

  //Se define el tipo de dato para el estado de la tarea
  status: {
    //El BOOLEAN nos ayuda a guardar true o false
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  //Campo foráneo para establecer la relación con la tabla users
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: "id_user",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
};

//Se define la clase Task que hereda de Model
class Task extends Model {
  //Se define la relación entre la tabla tasks y la tabla users
  static associate(models) {
    //Belongs To hace referencia a que una tarea pertenece a un usuario
    this.belongsTo(models.User, {
      foreignKey: "id_user",
      as: "user",
      //Se coloca si el usuario se elimina, se eliminan todas sus tareas
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
  //Se define la configuración de la tabla
  static config(sequelize) {
    return {
      sequelize,
      tableName: TASK_TABLE,
      modelName: "Task",
      timestamps: false,
    };
  }
}
//Se exporta la tabla tasks, el esquema y la clase Task
module.exports = { TASK_TABLE, TaskSchema, Task };