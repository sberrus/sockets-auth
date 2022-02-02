const socket = io();

socket.on("connect", () => {
	console.log("conectado");
});
