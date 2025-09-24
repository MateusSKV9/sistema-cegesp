document.addEventListener("DOMContentLoaded", function () {
	// Jhon: Seleção dos itens do Forms
	const form = document.getElementById("infodadosForm");
	const esferaSelect = document.getElementById("esfera");
	const ufGroup = document.getElementById("ufGroup");
	const ufSelect = document.getElementById("uf");
	const agrupamentoGroup = document.getElementById("agrupamentoGroup");
	const municipioGroup = document.getElementById("municipioGroup");
	const territorioGroup = document.getElementById("territorioGroup");
	const judiciarioOption = document.getElementById("judiciarioOption");
	const agrupamentoRadios = document.getElementsByName("agrupamento");

	// Jhon: Função de loading enquanto a API é requisitada
	function toggleLoading(element, loading) {
		if (loading) {
			element.classList.add("loading");
			element.disabled = true;
		} else {
			element.classList.remove("loading");
			element.disabled = false;
		}
	}

	// Jhon: Caso tenha algum erro, ele vai ser gerado aqui
	function showError(message) {
		const errorDiv = document.createElement("div");
		errorDiv.className = "error-message";
		errorDiv.textContent = message;
		errorDiv.style.color = "red";
		errorDiv.style.marginTop = "5px";
		return errorDiv;
	}

	// Jhon: Função para carregar as UFs da API do IBGE
	async function loadUFs() {
		toggleLoading(ufSelect, true);
		try {
			const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
			if (!response.ok) {
				throw new Error("Falha ao carregar estados");
			}
			const estados = await response.json();

			// Ordenar estados por nome
			estados.sort((a, b) => a.nome.localeCompare(b.nome));

			// Limpar opções existentes e mensagens de erro anteriores
			ufSelect.innerHTML = '<option value="">Selecione um estado</option>';
			const errorElement = ufGroup.querySelector(".error-message");
			if (errorElement) {
				errorElement.remove();
			}

			// Adicionar novos estados
			estados.forEach((estado) => {
				const option = document.createElement("option");
				option.value = estado.sigla.toLowerCase();
				option.textContent = `${estado.sigla} - ${estado.nome}`;
				ufSelect.appendChild(option);
			});
		} catch (error) {
			console.error("Erro ao carregar estados:", error);
			ufSelect.innerHTML = '<option value="">Erro ao carregar estados</option>';
			ufGroup.appendChild(
				showError("Não foi possível carregar a lista de estados. Tente novamente mais tarde.")
			);
		} finally {
			toggleLoading(ufSelect, false);
		}
	}

	// Jhon: Função para carregar os municípios de um estado
	async function loadMunicipios(uf) {
		const municipioSelect = document.getElementById("municipio");
		toggleLoading(municipioSelect, true);

		try {
			const response = await fetch(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
			);
			if (!response.ok) {
				throw new Error("Falha ao carregar municípios");
			}
			const municipios = await response.json();

			// Ordenar municípios por nome
			municipios.sort((a, b) => a.nome.localeCompare(b.nome));

			// Limpar opções existentes e mensagens de erro anteriores
			municipioSelect.innerHTML = '<option value="">Selecione um município</option>';
			const errorElement = municipioGroup.querySelector(".error-message");
			if (errorElement) {
				errorElement.remove();
			}

			// Adicionar novos municípios
			municipios.forEach((municipio) => {
				const option = document.createElement("option");
				option.value = municipio.id;
				option.textContent = municipio.nome;
				municipioSelect.appendChild(option);
			});
		} catch (error) {
			console.error("Erro ao carregar municípios:", error);
			municipioSelect.innerHTML = '<option value="">Erro ao carregar municípios</option>';
			municipioGroup.appendChild(
				showError("Não foi possível carregar a lista de municípios. Tente novamente mais tarde.")
			);
		} finally {
			toggleLoading(municipioSelect, false);
		}
	}

	function updateFormFields() {
		const esferaValue = esferaSelect.value;

		// Jhon: Limpa todos os campos primeiro, limpa os erros e depois mostra baseado na esfera
		ufGroup.classList.add("hidden");
		agrupamentoGroup.classList.add("hidden");
		municipioGroup.classList.add("hidden");
		territorioGroup.classList.add("hidden");
		judiciarioOption.style.display = "block";

		document.querySelectorAll(".error-message").forEach((el) => el.remove());

		switch (esferaValue) {
			case "federal":
				judiciarioOption.style.display = "block";
				break;
			case "estadual":
				ufGroup.classList.remove("hidden");
				judiciarioOption.style.display = "none";
				loadUFs();
				break;
			case "municipal":
				ufGroup.classList.remove("hidden");
				agrupamentoGroup.classList.remove("hidden");
				judiciarioOption.style.display = "none";
				loadUFs();
				break;
		}
	}

	// Jhon: Handler para mudança de agrupamento nos municipios

	function handleAgrupamentoChange(e) {
		municipioGroup.classList.add("hidden");
		territorioGroup.classList.add("hidden");

		if (e.target.value === "municipio") {
			municipioGroup.classList.remove("hidden");
		} else if (e.target.value === "territorio") {
			territorioGroup.classList.remove("hidden");
		}
	}

	// Jhon: Event listeners
	esferaSelect.addEventListener("change", updateFormFields);

	ufSelect.addEventListener("change", function (e) {
		if (e.target.value) {
			loadMunicipios(e.target.value);
		}
	});

	agrupamentoRadios.forEach((radio) => {
		radio.addEventListener("change", handleAgrupamentoChange);
	});

	form.addEventListener("submit", function (e) {
		e.preventDefault();
		console.log("Formulário enviado!");
	});

	updateFormFields();
});

//Mensagem de erro caso não haja preenchimento
/*
document.getElementById("infodadosForm").addEventListener("submit", function (event) {
	const poderSelect = document.querySelector('input[name="poder"]:checked');
	const msgErroPoder = document.getElementById("erroPoder");

	if (!poderSelect) {
		event.preventDefault();
		msgErroPoder.style.display = "block";
	} else {
		msgErroPoder.style.display = "none";
	}
});
*/
