//Llamamos al boton para asignarle el evento click
const GoogleSignoutButton = document.querySelector("#GoogleSignout");

if (!localStorage.getItem("correo")) {
	GoogleSignoutButton.style.display = "none";
	GoogleSignoutButton.disabled = true;
} else {
	GoogleSignoutButton.disabled = false;
}
GoogleSignoutButton.addEventListener("click", () => {
	console.log(google.accounts.id); //Esta propiedad nos permite acceder a los métodos para realizar correctamente el logout

	google.accounts.id.disableAutoSelect(); //??
	
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
