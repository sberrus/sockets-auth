// validar que exista el token
const _token = localStorage.getItem("token");
if (!_token) {
	window.location.href = location.origin;
}

const main = async () => {
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
		return;
	}

	const data = await res.json();
	console.log(data);
};

main();
