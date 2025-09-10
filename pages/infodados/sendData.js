document.getElementById("infodadosForm").addEventListener("submit", function (e) {
	e.preventDefault();

	const esfera = document.getElementById("esfera").value;
	const startYear = document.getElementById("start-year").value || null;
	const endYear = document.getElementById("end-year").value || null;

	//  function_select(esfera, startYear, endYear)

	const dadosMock = [
		{ id: 3, dado: "13245.67", ano: 2000, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 4, dado: "15032.88", ano: 2001, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 5, dado: "12109.45", ano: 2002, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 6, dado: "16987.22", ano: 2003, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 7, dado: "13876.33", ano: 2004, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 8, dado: "15743.90", ano: 2005, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 9, dado: "14320.11", ano: 2006, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 10, dado: "16089.75", ano: 2007, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 11, dado: "13450.28", ano: 2008, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 12, dado: "15234.55", ano: 2009, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 13, dado: "14987.66", ano: 2010, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 14, dado: "15500.12", ano: 2011, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 15, dado: "16234.78", ano: 2012, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 16, dado: "14789.34", ano: 2013, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 17, dado: "15890.56", ano: 2014, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 18, dado: "15321.44", ano: 2015, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 19, dado: "16123.67", ano: 2016, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 20, dado: "14987.12", ano: 2017, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 21, dado: "15765.89", ano: 2018, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 22, dado: "16345.23", ano: 2019, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 23, dado: "15123.45", ano: 2020, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 24, dado: "15987.65", ano: 2021, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 25, dado: "14876.54", ano: 2022, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 26, dado: "15432.10", ano: 2023, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 27, dado: "16001.23", ano: 2024, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 28, dado: "15234.56", ano: 2025, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 29, dado: "15876.43", ano: 2026, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 30, dado: "14999.99", ano: 2027, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 31, dado: "16111.11", ano: 2028, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 32, dado: "15333.33", ano: 2029, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 33, dado: "15777.77", ano: 2030, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 34, dado: "15050.50", ano: 2031, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 35, dado: "16222.22", ano: 2032, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 36, dado: "15444.44", ano: 2033, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 37, dado: "15999.99", ano: 2034, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 38, dado: "15111.11", ano: 2035, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 39, dado: "15555.55", ano: 2036, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 40, dado: "16000.00", ano: 2037, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 41, dado: "15222.22", ano: 2038, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 42, dado: "15888.88", ano: 2039, TipoDocumento: "PPA", PalavraChave: "vacina" },
		{ id: 43, dado: "15321.00", ano: 2040, TipoDocumento: "PPA", PalavraChave: "vacina" },
	];

	/*
		try {
		const dadosPesquisa = function_select(esfera, startYear, endYear);

		criarTabela(dados);
	} catch (error) {
		console.error("Erro ao buscar dados:", error);
		alert("Erro ao carregar dados.");
	}
*/
	criarTabela(dadosMock);
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

	["Tipo de Documento", "Palavra-Chave", "Dado", "Ano"].forEach((text) => {
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
		[item.TipoDocumento, item.PalavraChave, item.dado, item.ano].forEach((value) => {
			const td = document.createElement("td");
			td.textContent = value;
			row.appendChild(td);
		});
		tbody.appendChild(row);
	});
	table.appendChild(tbody);

	container.appendChild(table);
}
