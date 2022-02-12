const { Socket } = require("socket.io");

//Helpers
const { comprobarJWTFromSocket } = require("../helpers");

//Modelos
const { MensajesChat } = require("../models");

const mensajesChat = new MensajesChat();

/**
 * Controlador de los sockets
 * @param {*} socket Socket Object, Biblioteca para poder obtener ayudas en el editor de texto
 * @param {*} io Servidor de Sockets
 * @returns
 */
const socketController = async (socket = new Socket(), io) => {
	//Capturamos el token que nos envian desde el cliente en el header personalizado de socket.io.
	const token = socket.handshake.headers["token"];

	//Verificamos que el token sea válido y extraemos el usuario del mismo.
	const usuario = await comprobarJWTFromSocket(token);

	//Verificamos que el usuario se haya obtenido correctamente o cerramos conexión del socket
	if (!usuario) {
		return socket.disconnect();
	}

	//Agregar el usuario conectado
	mensajesChat.conectarUsuario(usuario);
	io.emit("usuarios-activos", mensajesChat.usuariosArr);

	socket.on("disconnect", () => {
		mensajesChat.desconectarUsuario(usuario.id);
		io.emit("usuarios-activos", mensajesChat.usuariosArr);
	});

	socket.on("enviar-mensaje", ({ mensaje, uid }) => {
		mensajesChat.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
		io.emit("recibir-mensaje", mensajesChat.ultimos10)
	});
};

module.exports = {
	socketController,
};
