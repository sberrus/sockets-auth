//Imports
const { Router } = require("express");
const { check, body, header } = require("express-validator");

//Controllers
const { login, googleSignIn, validarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares");

//Validator
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", [header("authorization").notEmpty(), validarCampos], validarJWT, validarToken);

router.post(
	"/",
	[
		check("correo").notEmpty().withMessage("El correo es obligatorio"),
		check("password").notEmpty().withMessage("La contraseña es obligatoria"),
		validarCampos,
	],
	login
);

router.post("/google", [body("id_token").notEmpty().withMessage("id_token es necesario")], validarCampos, googleSignIn);

module.exports = router;
