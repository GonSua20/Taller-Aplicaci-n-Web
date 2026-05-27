//Se importa la libreria sequelize
const { Sequelize } = require("sequelize");
//Se importan los modelos
const setupModels = require("../models");


//Se carga el archivo .env donde se encuentran las variables de entorno
require("dotenv").config();

//Se crea una instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
);

//Se inicializan los modelos
setupModels(sequelize);

//Se exporta la conexión a la base de datos
module.exports = sequelize;