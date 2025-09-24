document.getElementById("infodadosForm").addEventListener("submit", function (e) {
	e.preventDefault();

	const esfera = document.getElementById("esfera").value;
	const startYear = document.getElementById("start-year").value || null;
	const endYear = document.getElementById("end-year").value || null;

	const keyword = document.getElementById("keywordInput").value || null;
	//const poder = document.querySelector('input[name="poder"]:checked')?.value || null;
	//const documento = document.getElementById("documento").value;

	//mostrarFiltros({ palavraChave, esfera, poder, documento, startYear, endYear });

	mostrarFiltros({ keyword, esfera, startYear, endYear });

	DatabaseService.selecionarDocumentos(esfera, startYear, endYear)
		.then((jsonString) => {
			const dados = JSON.parse(jsonString); //transformar json em array de objetos
			dados.sort((a, b) => b.ano - a.ano);
			criarTabela(dados);
		})
		.catch((error) => {
			console.error("Erro ao buscar dados:", error);
			alert("Erro ao carregar dados.");
		});
});

////////////////////////////////////////////////////////////

function criarTabela(dados) {
	const container = document.getElementById("tabela-container");

	container.innerHTML = "";

	const table = document.createElement("table");
	table.classList.add("tabela-dados");

	//HEADER
	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	const headers = ["Tipo de Documento", "Palavra-Chave", "Dado", "Ano"];

	headers.forEach((text) => {
		const th = document.createElement("th");
		th.textContent = text;
		headerRow.appendChild(th);
	});
	thead.appendChild(headerRow);
	table.appendChild(thead);

	//BODY
	const tbody = document.createElement("tbody");
	dados.forEach((item) => {
		const row = document.createElement("tr");
		[item.TipoDocumento, item.PalavraChave, item.dado, item.ano].forEach((value, index) => {
			const td = document.createElement("td");
			td.textContent = value;
			td.setAttribute("data-label", headers[index]);
			row.appendChild(td);
		});
		tbody.appendChild(row);
	});
	table.appendChild(tbody);

	container.appendChild(table);
}

function mostrarFiltros(esfera, startYear, endYear) {
	const filtrosDiv = document.getElementById("filtrosSelecionados");
	filtrosDiv.innerHTML = `<strong>Filtros Selecionados:</strong> Esfera: ${esfera}, Ano Início: ${
		startYear || "N/A"
	}, Ano Fim: ${endYear || "N/A"}`;
}

/////////////////////////////

function mostrarFiltros({ keyword, esfera, startYear, endYear }) {
	const filtrosDiv = document.getElementById("filtrosSelecionados");

	// Casos de Períodos
	let periodoTexto;
	if (startYear && endYear) {
		periodoTexto = `${startYear} - ${endYear}`;
	} else if (startYear && !endYear) {
		periodoTexto = `${startYear} em diante`;
	} else if (!startYear && endYear) {
		periodoTexto = `até ${endYear}`;
	} else {
		periodoTexto = "todos";
	}

	let esferaTexto;
	if (esfera === "f") {
		esferaTexto = "Federal";
	} else if (esfera === "e") {
		esferaTexto = "Estadual";
	} else if (esfera === "m") {
		esferaTexto = "Municipal";
	}

	filtrosDiv.innerHTML = `
		<h3>Filtros Selecionados:</h3>
		<p>Palavra-Chave: ${keyword}</p>
		<p>Esfera: ${esferaTexto}</p>
		<p>Período: ${periodoTexto} </p>
	`;
}
