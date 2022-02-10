//
// INICIAR SESION
//
//Función que se ejecuta al finalizar el proceso de logeo de google, callback que devuelve una response con las credenciales del usuario logeado.
async function handleCredentialResponse(response) {
	const body = { id_token: response.credential };
	console.log(body);
	await axios({
		method: "POST",
		url: "/api/auth/google",
		data: body,
	})
		.then((res) => {
			//Almacenamos el correo del usuario logeado y lo almacenamos en localstorage para poder utilizarlo luego para realizar el logout
			localStorage.setItem("correo", res.data.usuario.correo);
			localStorage.setItem("token", res.data.token);
			console.log(res.data);
			location.href = location.origin + "/chat.html";
		})
		.catch((err) => {
			console.log(err);
			console.log(err?.response?.data);
		});
	//Google Token A.K.A = ID_TOKEN
}
