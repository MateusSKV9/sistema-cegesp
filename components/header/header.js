class Header extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		try {
			const [globalCss, headerCss, headerPhoneCss, headerTabletCss, mediaQueries, headerHtml] = await Promise.all(
				[
					fetch("./styles/global.css").then((res) => res.text()),
					fetch("./components/header/styles/header.css").then((res) => res.text()),
					fetch("./components/header/styles/header_phone.css").then((res) => res.text()),
					fetch("./components/header/styles/header_tablet.css").then((res) => res.text()),
					fetch("./styles/media-queries/medias-queries.css").then((res) => res.text()),
					fetch("./components/header/header.html").then((res) => res.text()),
				]
			);

			this.shadowRoot.innerHTML = `
        <style>${globalCss}</style>
        <style>${headerCss}</style>
        <style>${headerPhoneCss}</style>
        <style>${headerTabletCss}</style>
        <style>${mediaQueries}</style>

        ${headerHtml}
        
      `;
		} catch (error) {
			console.error("Erro ao carregar os recursos do header:", error);
		}
	}
}

customElements.define("my-header", Header);
