const signInForm = document.querySelector("form");

signInForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log("jasasjfhlasjkdfh");
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
			console.log(res.token);
			localStorage.setItem("token", res.token);
			window.location.href = "http://localhost:8080/chat.html";
		})
		.catch((err) => console.log(err));
});
