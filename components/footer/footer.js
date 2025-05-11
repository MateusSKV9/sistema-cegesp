class Footer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		try {
			// Buscar todos os arquivos CSS e o HTML
			const [globalCss, footerCss, footerPhoneCss, footerTabletCss, footerHtml] = await Promise.all(
				[
					fetch("/styles/global.css").then((res) => res.text()),
					fetch("/components/footer/styles/footer.css").then((res) => res.text()),
					fetch("/components/footer/styles/footer_phone.css").then((res) => res.text()),
					fetch("/components/footer/styles/footer_tablet.css").then((res) => res.text()),
					fetch("/components/footer/footer.html").then((res) => res.text()),
				]
			);

			// Combinar todos os estilos em um único bloco de <style>
			this.shadowRoot.innerHTML = `
        <style>
          ${globalCss}
          ${footerCss}
          ${footerPhoneCss}
          ${footerTabletCss}
        </style>
        ${footerHtml}
      `;

			// Adicionar o script do Font Awesome no Shadow DOM
			const fontAwesomeScript = document.createElement("script");
			fontAwesomeScript.src = "https://kit.fontawesome.com/0a1412cd70.js";
			fontAwesomeScript.crossOrigin = "anonymous";
			this.shadowRoot.appendChild(fontAwesomeScript);

      // Esperar pelo carregamento do script para garantir que os ícones funcionem
      fontAwesomeScript.onload = () => {
        console.log('Font Awesome carregado no footer');
      };
      
      this.shadowRoot.appendChild(fontAwesomeScript);
		} catch (error) {
			console.error("Erro ao carregar os recursos do footer:", error);
		}
	}
}

customElements.define("my-footer", Footer);
