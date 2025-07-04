const link_about = document.querySelector("#about > a");
const about_menu = document.querySelector("#about-menu");
const news_menu = document.querySelector("#news-menu");
const link_news = document.querySelector("#news > a");

if (window.innerWidth <= 900) {
	link_about.addEventListener("click", () => {
		about_menu.classList.toggle("show");
		news_menu.classList.remove("show");
	});

	link_news.addEventListener("click", () => {
		news_menu.classList.toggle("show");
		about_menu.classList.remove("show");
	});

	const menu_toggle = document.querySelector(".menu-toggle");
	const nav_header = document.querySelector(".nav-header");
	const nav_group = document.querySelector(".nav-group");

	menu_toggle.addEventListener("click", () => {
		nav_header.classList.toggle("active");
	});

	document.addEventListener("click", function (event) {
		if (window.innerWidth <= 600) {
			if (
				!event.target.closest(".menu-toggle") &&
				!nav_group.contains(event.target) &&
				nav_header.classList.contains("active")
			) {
				nav_header.classList.remove("active");
			}
		}
	});
}
