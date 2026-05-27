//Se importa el modelo de la tabla users
const { models } = require("../libs/sequelize");

class UserService {
  //Esto hace que se traigan todos los usuarios
  async findAll() {
    return await models.User.findAll();
  }
  //Esto hace que se traiga un usuario por su id
  async findById(id) {
    //Se busca el usuario por su id
    const user = await models.User.findByPk(id);
    //Con esto verificamos si el usuario existe
    if (!user) {
      //Si no existe, se lanza un error
      throw new Error("Usuario no encontrado");
    }
    return {
      message: "Usuario encontrado exitosamente",
      data: user,
    };
  }
  //Esto hace que se cree un usuario
  async create(data) {
    //Se obtiene el email del usuario
    const { email } = data;

    //Con esto verificamos si el usuario ya existe
    const user = await models.User.findOne({ where: { email } });
    if (user) {
      throw new Error("El correo electrónico ya existe");
    }
    return {
      message: "Usuario creado exitosamente",
      data: await models.User.create(data),
    };
  }
  //Esto hace que se actualice un usuario
  async update(id, data) {
    //Con await quiere decir que espere a que la función se ejecute
    return {
      message: "Usuario actualizado exitosamente",
      data: await models.User.update(data, { where: { id_user: id } }),
    };
  }
  //Esto hace que se elimine un usuario
  async delete(id) {
    //Con await quiere decir que espere a que la función se ejecute
    return {
      message: "Usuario eliminado exitosamente",
      data: await models.User.destroy({ where: { id_user: id } }),
    };
  }
}

module.exports = UserService;
