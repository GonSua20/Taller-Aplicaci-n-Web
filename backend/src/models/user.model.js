//Se importa DataTypes y Model de la libreria sequelize 
const { DataTypes, Model } = require("sequelize");

//Se define el nombre de la tabla
const USER_TABLE = "users";

//Se define el esquema de la tabla users
const UserSchema = {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  //Se define el tipo de dato para el nombre del usuario
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  //Se define el tipo de dato para el correo electrónico del usuario
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
};

//Se define la clase User que hereda de Model
class User extends Model {
  //Se define la relación entre la tabla users y la tabla tasks
  static associate(models) {
    //Has Many hace referencia a que un usuario puede tener muchas tareas
    this.hasMany(models.Task, {
      foreignKey: "id_user",
      as: "tasks",
    });
  }

  //Esto hace referencia al nombre de la tabla en la base de datos
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: false,
    };
  }
}
//Se exporta la tabla users, el esquema y la clase User
module.exports = { USER_TABLE, UserSchema, User };