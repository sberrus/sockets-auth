//Imports
const express = require("express");
const { createServer } = require("http"); //Paquete para iniciar el servidor de Socket.io

//Middlewares
const cors = require("cors");
const fileUpload = require("express-fileupload");

//Configs
const { dbConection } = require("../database/config");

//Socket Controller
const { socketController } = require("../sockets/controller");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		//Inicializamos server de Socket.io
		this.server = createServer(this.app);
		this.io = require("socket.io")(this.server); //IIEF recive como argumento el server que inicializamos para Socket.io

		//No optimizado
		// this.usersPath = "/api/users";
		// this.authPath = "/api/auth";
		// this.categoriesPath = "/api/categories";

		//Optimizado
		this.paths = {
			users: "/api/users",
			auth: "/api/auth",
			categories: "/api/categories",
			products: "/api/products",
			busquedas: "/api/busquedas",
			uploads: "/api/uploads",
		};

		//DB Conection
		this.conectarDB();

		//Middlewares
		this.middlewares();

		//Rutas de la app
		this.routes();

		//Sockets
		this.sockets();
	}

	async conectarDB() {
		await dbConection();
	}

	middlewares() {
		//Directorio público
		this.app.use(express.static("public"));

		//Cors config
		this.app.use(cors());

		//Lectura y parseo del body
		this.app.use(express.json());

		//Carga de archivos
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: "/tmp/",
				createParentPath: true,
			})
		);
	}

	routes() {
		//Se suele ordenar las rutas por orden alfabético.
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.users, require("../routes/user"));
		this.app.use(this.paths.categories, require("../routes/categories"));
		this.app.use(this.paths.products, require("../routes/products"));
		this.app.use(this.paths.busquedas, require("../routes/busquedas"));
		this.app.use(this.paths.uploads, require("../routes/uploads"));
	}

	sockets() {
		this.io.on("connection", socketController);
	}

	listen() {
		//Inicializamos el server del socket ya que vamos a trabajar con este.

		this.server.listen(this.port, () => {
			console.log(`Servidor socket.io corriendo en puerto ${this.port}`);
		});

		//~ ANTES ~
		// this.app.listen(this.port, () => {
		// 	console.log(`Servidor corriendo en puerto ${this.port}`);
		// });
	}
}
module.exports = Server;
