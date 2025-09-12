/** DEFINE O EVENTO DO CLICK NO BTN DE HAMBURGER */
const menu_toggle = document.querySelector("#menu-toggle"); // obtém a ref do btn de hamburger
menu_toggle.addEventListener("click", function (e) {
	// adiciona o evento de click
	const navGroup = document.getElementById("nav-group"); // obtém ref do menu
	navGroup.classList.toggle("show"); // aplica e desaplica a classe show (responsável por aparecer e desaparecer com o menu)
});

/** DEFINE O EVENTO DO CLICK NOS BTNs DOS SUBMENUS */
const menuItems = document.querySelectorAll(".has-submenu > a"); // obtém a ref de todos os links clicáveis dos btns com submenu
menuItems.forEach(function (menuItem) {
	// percorre os liks clicáveis de cada btn com submenu
	menuItem.addEventListener("click", function (e) {
		// adiciona um evento de click a cada um deles
		e.preventDefault(); // evita a resposta padrão de click no link <a>
		const submenu = this.nextElementSibling; // obtem a lista <ul> do submenu
		if (submenu) {
			submenu.classList.toggle("show");
		} // mostra o submenu
		console.log("click!");
	});
	// Evento de mouseout no submenu (fecha ao sair)
	const submenu = menuItem.nextElementSibling;
	if (submenu) {
		submenu.addEventListener("mouseleave", function () {
			submenu.classList.remove("show");
			console.log("submenu fechado por mouseout");
		});
	}
});
