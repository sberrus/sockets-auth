const { request } = require("express");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const validarJWT = async (req = request, res, next) => {
	//los jwt por parte del cliente se suelen enviar mediante los headers de la petición por lo que deberemos capturar en el header el jwt para poder verificarlo.
	const token = req.header("authorization");
	if (!token) {
		return res.status(401).json({ msg: "token obligatorio" });
	}
	try {
		//Verificar el JWT, el primer argumento es el token que deseamos verificar y el segundo es la llave privada que nos permite realizar la verificación.
		const { uid } = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY);

		// leer el usuario que corresponde al uid
		const usuario = await Usuario.findById(uid);

		if (!usuario) {
			return res.status(401).json({
				msg: "Token no válido - usuario no existe DB",
			});
		}

		// Verificar si el uid tiene estado true
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "Token no válido - usuario con estado: false",
			});
		}

		req.usuario = usuario;
		req.uid = uid;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ msg: "token no válido aqui", error });
	}
};

module.exports = { validarJWT };
