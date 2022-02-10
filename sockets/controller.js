const { Socket } = require("socket.io"); //Obtenemos el Socket solamente para que VSCode nos ayude con la documentación.

//Helpers
const { comprobarJWTFromSocket } = require("../helpers");

//Usamos new Socket() como "default parameter" para poder obtener la documentación a la hora de programar.
//Hay que tomar en cuenta que al momento de enviar a producción hay que eliminar estos pasos para evitar problemas y errores de seguridad.
const socketController = async (socket = new Socket()) => {
	//Capturamos el token que nos envian desde el cliente
	const token = socket.handshake.headers["token"];

	//Verificamos que el token sea válido y extraemos el usuario del mismo.
	const usuario = await comprobarJWTFromSocket(token);

	//Verificamos que el usuario se haya obtenido correctamente o cerramos conexión del socket
	if (!usuario) {
		return socket.disconnect();
	}
	console.log(`Cliente ${usuario.nombre} conectado`);
};

module.exports = {
	socketController,
};
