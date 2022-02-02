// validar que exista el token
const _token = localStorage.getItem("token");
if (!_token) {
	window.location.href = "http://localhost:8080";
}

//Validar que token sea válido
fetch("api/auth", {
	headers: {
		"Content-Type": "application/json",
		authorization: localStorage.getItem("token"),
	},
})
	.then((res) => {
		if (res.status !== 200) {
			location.href = "http://localhost:8080";
			localStorage.removeItem("token");
			return;
		}
		res.json();
	})
	.then((res) => console.log(res))
	.catch((err) => console.log(err));
