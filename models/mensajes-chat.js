/**
 * Objeto Constructor de mensajes
 */
class Mensaje {
	constructor(uid, nombre, mensaje) {
		this.uid = uid;
		this.nombre = nombre;
		this.mensaje = mensaje;
	}
}

/**
 * Objeto controlador de chat
 */
class MensajesChat {
	constructor() {
		this.mensajes = [];
		this.usuarios = {};
	}

	/**
	 * Obtiene los 10 últimos mensajes almacenados
	 */
	get ultimos10() {
		this.mensajes = this.mensajes.splice(0, 10);
		return this.mensajes;
	}

	/**
	 * Obtiene todos los usuarios conectados en el servidor
	 */
	get usuariosArr() {
		return Object.values(usuarios);
	}

	/**
	 * Almacena el mensaje que se ha enviado en el historial de chats
	 * @param {*} uid Uid de mongodb
	 * @param {*} nombre Nombre de usuario
	 * @param {*} mensaje Mensaje a enviar
	 */
	enviarMensaje(uid, nombre, mensaje) {
		this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
	}

	/**
	 * Agrega al usuario conectado a la lista de usuarios conectados
	 * @param {*} usuario Modelo de MongoDB
	 */
	conectarUsuario(usuario) {
		this.usuarios[usuario.id] = usuario;
	}

	/**
	 * Elimina el usuario de la lista de usuarios conectados
	 * @param {*} id Uid de MongoDB
	 */
	desconectarUsuario(id) {
		delete this.usuarios[id];
	}
}

module.exports = MensajesChat;
