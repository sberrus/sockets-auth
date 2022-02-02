//#region Form Controller

const signInForm = document.querySelector("form");

signInForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const formData = {
		correo: signInForm.elements.emailInput.value,
		password: signInForm.elements.passwordInput.value,
	};

	fetch("/api/auth", {
		method: "POST",
		body: JSON.stringify(formData),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.msg || res.errors) {
				return console.log("Ha ocurrido un error", res.errors || res.msg);
			}
			localStorage.setItem("token", res.token);
			window.location.href = "http://localhost:8080/chat.html";
		})
		.catch((err) => console.log(err));
});

//#endregion

//#region Google Auth
//Función que se ejecuta al finalizar el proceso de logeo de google, callback que devuelve una response con las credenciales del usuario logeado.
async function handleCredentialResponse(response) {
	const body = { id_token: response.credential };
	await axios({
		method: "POST",
		url: "/api/auth/google",
		data: body,
	})
		.then((res) => {
			//Almacenamos el correo del usuario logeado y lo almacenamos en localstorage para poder utilizarlo luego para realizar el logout
			localStorage.setItem("correo", res.data.usuario.correo);
			localStorage.setItem("u-token", JSON.stringify(res.data.token));
			location.reload();
		})
		.catch((err) => {
			console.log(err);
			console.log(err?.response?.data);
		});
	//Google Token A.K.A = ID_TOKEN
}

//Llamamos al boton para asignarle el evento click
const signoutButton = document.querySelector("#signout");
if (!localStorage.getItem("correo")) {
	signoutButton.style.display = "none";
	signoutButton.disabled = true;
} else {
	signoutButton.disabled = false;
}
signoutButton.addEventListener("click", () => {
	console.log(google.accounts.id); //Esta propiedad nos permite acceder a los métodos para realizar correctamente el logout
	//??
	google.accounts.id.disableAutoSelect();
	//Método para realizar el logout. Enviamos como primer parámetro el correo del usuario que deseamos deslogear.
	google.accounts.id.revoke(
		localStorage.getItem("correo"),
		//Como segundo parametro enviamos un callback que se ejecutará al momento de haberse completado el deslogueo correctamente.
		(done) => {
			//limpiamos localstorage y recargamos la página.
			localStorage.clear();
			location.reload();
		}
	);
});

if (localStorage.getItem("u-token")) {
	console.log(JSON.parse(localStorage.getItem("u-token")));
}
//#endregion
