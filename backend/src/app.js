const express = require("express");
//Morgan sirve para ver las peticiones que llegan al servidor
const morgan = require("morgan");
//Cors nos ayuda a evitar los errores de origen cruzado
const cors = require("cors");

require("dotenv").config();

const routerApi = require("./routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

routerApi(app);

app.listen(process.env.PORT, () => {
  console.log(`Puerto corriendo en http://localhost:${process.env.PORT}`);
});
