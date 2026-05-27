//Se importa el servicio de usuarios
const UserService = require("../services/user.service");

//Se crea una instancia del servicio de usuarios
const userService = new UserService();

//Se define la clase UserController
class UserController {
  //Esto hace que se traigan todos los usuarios
  async findAll(req, res) {
    //El try catch sirve para atrapar errores y que la aplicacion no se caiga
    try {
      //Se ejecuta la funcion findAll del servicio de usuarios
      const users = await userService.findAll();
      //Se retorna la respuesta en formato json
      return res.json(users);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se traiga un usuario por su id
  async findById(req, res) {
    try {
      //Se obtiene el id del usuario
      const { id } = req.params;
      //Se trae el usuario por su id
      const user = await userService.findById(id);
      //Se retorna la respuesta en formato json
      return res.json(user);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se cree un usuario
  async create(req, res) {
    try {
      //Se obtiene el body de la peticion
      const { body } = req;
      //Se crea el usuario
      const user = await userService.create(body);
      //Se retorna la respuesta en formato json
      return res.json(user);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se actualice un usuario
  async update(req, res) {
    try {
      //Se obtiene el id del usuario
      const { id } = req.params;
      //Se obtiene el body de la peticion
      const { body } = req;
      //Se actualiza el usuario
      const user = await userService.update(id, body);
      //Se retorna la respuesta en formato json
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  //Esto hace que se elimine un usuario
  async delete(req, res) {
    try {
      //Se obtiene el id del usuario
      const { id } = req.params;
      //Se elimina el usuario
      const user = await userService.delete(id);
      //Se retorna la respuesta en formato json
      return res.json(user);
    } catch (error) {
      //Si hay un error, se retorna la respuesta en formato json
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserController;