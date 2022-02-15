//Script para validar que el token exista y que sea válido

let usuario;
let socket;

//Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");

/**
 * VALIDAMOS QUE EL JWT DE INICIO DE SESIÓN ENVIADO DESDE EL BACKEND SEA VÁLIDO
 * @returns void
 */
const validarJWT = async () => {
	// validar que exista el token
	const _token = localStorage.getItem("token");
	if (!_token) {
		window.location.href = location.origin;
		localStorage.removeItem("correo");
		localStorage.removeItem("token");
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
	socket = io({
		extraHeaders: {
			token: localStorage.getItem("token"),
		},
	});

	socket.on("connect", () => {
		// Logica para cuando hay conexión socket-cliente.
		console.log("Socket conectado");
	});

	socket.on("disconnect", () => {
		// Logica para cuando no hay conexión socket-cliente.
		console.log("Socket desconectado");
	});

	socket.on("recibir-mensaje", (payload) => {
		pintarMensajes(payload);
	});
	socket.on("usuarios-activos", pintarListaUsuarios);
	socket.on("recibir-mensaje-privado", (payload) => {
		console.log("Privado: ", payload);
	});
};

/**
 * Lísta a todos los usuarios conectados en el chat
 * @param {*} usuarios Lista de usuarios que recibimos del backend
 */
const pintarListaUsuarios = (usuarios = []) => {
	let usuariosHtml = "";
	//Esta no es la forma más optima de pintar los usuarios y va a depender de la libreria
	//la cual estemos utilizando para el frontend ya sea React, Vue, Angular etc...
	//En js plano la forma más ideal es usando los fragments de JS
	usuarios.forEach(({ nombre, uid }) => {
		usuariosHtml += `
		
		<li>
			<p>
				<h5 class="text-success">${nombre}</h5>
				<span class"fs-6 text-muted">${uid}</span>
			</p>
		</li>

		`;
	});
	ulUsuarios.innerHTML = usuariosHtml;
};

/**
 * Pinta todos los mensajes del chat
 * @param {*} mensajes Lista de mensajes que queremos pintar
 */
const pintarMensajes = (mensajes = []) => {
	let mensajesHTML = "";
	//Esta no es la forma más optima de pintar los usuarios y va a depender de la libreria
	//la cual estemos utilizando para el frontend ya sea React, Vue, Angular etc...
	//En js plano la forma más ideal es usando los fragments de JS
	mensajes.forEach(({ nombre, mensaje }) => {
		mensajesHTML += `
		
		<li class="py-1 px-3 mb-1">
				<small class="text-success">${nombre}: </small>
				<span class"text-secondary">${mensaje}</span>
		</li>

		`;
	});
	ulMensajes.innerHTML = mensajesHTML;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
	const mensaje = txtMensaje.value;
	const uid = txtUid.value;

	//Validaciones simples solo para ejemplo.
	if (keyCode !== 13) return;
	if (mensaje.length === 0) return;

	socket.emit("enviar-mensaje", { mensaje, uid });

	txtMensaje.value = "";
});

const main = async () => {
	//Validar JWT
	await validarJWT();
};

main();
