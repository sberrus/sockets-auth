//Obtenemos location
const { pathname } = location;

//Rutas que requieren autenticacion
const privateRoutes = ["/chat.html"];

//Rutas para esconder luego de logeo
const notLoggedAllowedRoutes = ["/"];

//datos de loggeo
const correo = localStorage.getItem("correo");
const token = localStorage.getItem("token");

//Verificar que las rutas privada solo puedan ser accedidas con usuario autenticado
if (!token && privateRoutes.includes(pathname)) {
	console.error("no hay token");
	location.href = location.origin;
}

//Verificar si hay usuario autenticado, sacar de rutas no privadas ni públicas
if ((token || correo) && notLoggedAllowedRoutes.includes(pathname)) {
	location.href = location.origin + "/chat.html";
}
