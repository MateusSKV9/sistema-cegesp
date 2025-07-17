const link_about = document.querySelector("#about > a");
const about_menu = document.querySelector("#about-menu");
const news_menu = document.querySelector("#news-menu");
const link_news = document.querySelector("#news > a");
const menu_toggle = document.querySelector(".menu-toggle");
const nav_header = document.querySelector(".nav-header");
const nav_group = document.querySelector(".nav-group");

if (window.innerWidth <= 900) {
	if (link_about) {
		link_about.addEventListener("click", () => {
			about_menu.classList.toggle("show");
			news_menu.classList.remove("show");
		});
	}

	if (link_news) {
		link_news.addEventListener("click", () => {
			news_menu.classList.toggle("show");
			about_menu.classList.remove("show");
		});
	}

	if (menu_toggle) {
		menu_toggle.addEventListener("click", () => {
			nav_header.classList.toggle("active");
		});

		document.addEventListener("click", function (event) {
			if (window.innerWidth <= 900) {
				if (
					!event.target.closest(".menu-toggle") &&
					!nav_group.contains(event.target) &&
					nav_header.classList.contains("active") &&
					!link_about.contains(event.target) &&
					!link_news.contains(event.target)
				) {
					nav_header.classList.remove("active");
				}

				if (!link_about.contains(event.target) && about_menu.classList.contains("show")) {
					about_menu.classList.remove("show");
				}

				if (!link_news.contains(event.target) && news_menu.classList.contains("show")) {
					news_menu.classList.remove("show");
				}
			}
		});
	}
} 
