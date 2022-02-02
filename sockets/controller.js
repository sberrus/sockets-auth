const { Socket } = require("socket.io"); //Obtenemos el Socket solamente para que VSCode nos ayude con la documentación.

//Usamos new Socket() como "default parameter" para poder obtener la documentación a la hora de programar.
//Hay que tomar en cuenta que al momento de enviar a producción hay que eliminar estos pasos para evitar problemas y errores de seguridad.
const socketController = (socket = new Socket()) => {
	console.log("Cliente Conectado", socket.id);
};

module.exports = {
	socketController,
};
