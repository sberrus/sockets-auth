//Script para validar que el token exista y que sea válido

let usuario;

const main = async () => {
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

	if (res.status !== 200) {
		location.href = location.origin;
		localStorage.removeItem("token");
		console.log(await res.json());
		return;
	}

	const { usuario: usuarioDB, token: tokenDB } = await res.json();

	console.log(usuarioDB);

	localStorage.setItem("token", tokenDB);

	usuario = usuarioDB;

	document.title = `Bienvenido ${usuario.nombre}`;
};

main();
