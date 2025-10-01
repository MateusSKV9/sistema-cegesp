document.getElementById("infodadosForm").addEventListener("submit", function (e) {
	e.preventDefault();

	const esfera = document.getElementById("esfera").value;
	const startYear = document.getElementById("start-year").value || null;
	const endYear = document.getElementById("end-year").value || null;
	const keyword = document.getElementById("keywordInput").value || null;
	const TipoDoc = document.getElementById("documento").value;

	//converter para uppercase para match com o banco
	let tipoDocBanco = TipoDoc.toUpperCase();

	if (TipoDoc === "termo_posse") {
		tipoDocBanco = "Termo Posse";
	} else if (TipoDoc === "plano_governo") {
		tipoDocBanco = "Plano de Governo";
	} else if (TipoDoc === "msg_anual") {
		tipoDocBanco = "Mensagem Anual";
	}

	console.log("Enviando para banco:", { esfera, startYear, endYear, tipoDocBanco });

	mostrarFiltros({ keyword, esfera, startYear, endYear, TipoDoc });

	DatabaseService.selecionarDocumentos(esfera, startYear, endYear, tipoDocBanco)
		.then((jsonString) => {
			console.log("Resposta bruta:", jsonString);
			const dados = JSON.parse(jsonString);
			console.log("Dados parseados:", dados);
			dados.sort((a, b) => b.ano - a.ano);
			criarTabela(dados);
		})
		.catch((error) => {
			console.error("Erro completo:", error);
			alert("Erro ao carregar dados: " + error.message);
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

/////////////////////////////

function mostrarFiltros({ keyword, esfera, startYear, endYear, TipoDoc }) {
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
	let tipoDocTexto;
	if (TipoDoc.toLowerCase() === "loa") {
		tipoDocTexto = "LOA";
	} else if (TipoDoc.toLowerCase() === "ldo") {
		tipoDocTexto = "LDO";
	} else if (TipoDoc.toLowerCase() === "ppa") {
		tipoDocTexto = "PPA";
	} else if (TipoDoc.toLowerCase() === "termo_posse") {
		tipoDocTexto = "Termo de Posse";
	} else if (TipoDoc.toLowerCase() === "decretos") {
		tipoDocTexto = "Decretos";
	} else if (TipoDoc.toLowerCase() === "plano_governo") {
		tipoDocTexto = "Plano de governo";
	} else if (TipoDoc.toLowerCase() === "msg_anual") {
		tipoDocTexto = "Mensagem Anual";
	} else {
		tipoDocTexto = TipoDoc;
	}

	filtrosDiv.innerHTML = `
	<div class="filtros-box">
		<h3>Filtros Selecionados:</h3>
		<p>Palavra-Chave: ${keyword}</p>
		<p>Esfera: ${esferaTexto}</p>
		<p>Tipo de Documento: ${tipoDocTexto}</p>
		<p>Período: ${periodoTexto} </p>
	</div>
	`;
}
