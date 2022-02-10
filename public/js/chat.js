//Script para validar que el token exista y que sea válido

let usuario;

/**
 * VALIDAMOS QUE EL JWT DE INICIO DE SESIÓN ENVIADO DESDE EL BACKEND SEA VÁLIDO
 * @returns void
 */
const validarJWT = async () => {
	// validar que exista el token
	const _token = localStorage.getItem("token");
	if (!_token) {
		window.location.href = location.origin;
	}

	//Validar que token sea válido
	const res = await fetch(location.origin + "/api/auth", {
		headers: {
			"Content-Type": "application/json",
			authorization: localStorage.getItem("token"),
		},
	});
	//Si hay algún error redireccionar a index
	if (res.status !== 200) {
		localStorage.removeItem("token");
		location.href = location.origin;
		return;
	}
	const { usuario: usuarioDB, token: tokenDB } = await res.json();

	//Guardar nuevo Token válidado
	localStorage.setItem("token", tokenDB);

	//Asignar información a la página
	usuario = usuarioDB;
	document.title = `Bienvenido ${usuario.nombre}`;

	//Después de verificar que el usuario este correctamente logeado conectamos el socket
	await conectarSocket();
};

/**
 * Inicializa conexión con el backend mediante socket.oi
 */
const conectarSocket = async () => {
	/**
	 * La función io() que inicializa la conexión con el backend recibe
	 * como argumento un objeto con unas configuraciones que usamos para enviar
	 * información al backend al momento de inicializar la conexión.
	 *
	 * Usaremos la propiedad "extraHeaders" que nos sirve para enviar headers adicionales al
	 * momento de iniciar una nueva conexión con el backend
	 */
	const socket = io({
		extraHeaders: {
			token: localStorage.getItem("token"),
		},
	});
};

const main = async () => {
	//Validar JWT
	await validarJWT();
};

main();
