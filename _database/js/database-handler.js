/**
 * ===================================================================================
 * MÓDULO DE SERVIÇO DO BANCO DE DADOS
 * ===================================================================================
 * Versão final que retorna uma string JSON formatada, e a seção de testes
 * exibe essa string diretamente no console.
 * ===================================================================================
 */

const DatabaseService = {
	db: null,
	isInitialized: false,

	/**
	 * Inicializa o serviço, carregando o arquivo do banco de dados.
	 * @returns {Promise<void>}
	 * @throws {Error} Lança um erro se a inicialização falhar.
	 */
	async initialize() {
		try {
			const SQL = await initSqlJs({
				locateFile: (file) => `/_database/lib/${file}`,
			});
			const response = await fetch("/_database/banco.sqlite");

			if (!response.ok) {
				throw new Error(`Erro ao buscar o banco. Status: ${response.status}`);
			}

			const buffer = await response.arrayBuffer();
			this.db = new SQL.Database(new Uint8Array(buffer));
			this.isInitialized = true;
		} catch (err) {
			this.isInitialized = false;
			throw err;
		}
	},
	/**
	 * Busca documentos com base na esfera, período e tipo de documento.
	 *
	 * @param {string} esfera - A esfera do documento ('f', 'e', 'm').
	 * @param {number} [anoInicio = null] - O ano de início do período (opcional).
	 * @param {number} [anoFim = null] - O ano de fim do período (opcional).
	 * @param {string} [tipoDocumento = null] - O nome do tipo de documento (opcional).
	 * @returns {Promise<string>} Uma promessa que resolve para uma string JSON formatada.
	 * @throws {Error} Lança um erro se a validação ou a consulta falhar.
	 */
	async selecionarDocumentos(esfera, anoInicio = null, anoFim = null, tipoDocumento = null) {
		if (!this.isInitialized) {
			throw new Error("Banco de dados não inicializado.");
		}
		if (!esfera) {
			throw new Error("O parâmetro 'esfera' é obrigatório.");
		}

		try {
			const selectClause = `
      SELECT
        D.id, D.dado, D.ano,
        TD.nome AS TipoDocumento,
        PC.nome AS PalavraChave
    `;
			let fromClause = "";
			const whereConditions = [];
			const params = {};

			switch (esfera.toLowerCase()) {
				case "m":
					fromClause = `FROM DocumentoMunicipal AS DM JOIN Documento AS D ON DM.idDocumento = D.id`;
					break;
				case "e":
					fromClause = `FROM DocumentoEstadual AS DE JOIN Documento AS D ON DE.idDocumento = D.id`;
					break;
				case "f":
					fromClause = `FROM DocumentoFederal AS DF JOIN Documento AS D ON DF.idDocumento = D.id`;
					break;
				default:
					throw new Error(`Esfera desconhecida: ${esfera}`);
			}

			const commonJoins = `
      LEFT JOIN TipoDocumento AS TD ON D.idTipoDocumento = TD.id
      LEFT JOIN PalavraChave AS PC ON D.idPalavraChave = PC.id
    `;

			if (anoInicio) {
				whereConditions.push(`D.ano >= :anoInicio`);
				params[":anoInicio"] = anoInicio;
			}
			if (anoFim) {
				whereConditions.push(`D.ano <= :anoFim`);
				params[":anoFim"] = anoFim;
			}
			if (tipoDocumento) {
				whereConditions.push(`TD.nome = :tipoDocumento`);
				params[":tipoDocumento"] = tipoDocumento;
			}

			const whereClause =
				whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
			const finalQuery = `${selectClause} ${fromClause} ${commonJoins} ${whereClause}`;

			const stmt = this.db.prepare(finalQuery);
			stmt.bind(params);

			const resultados = [];
			while (stmt.step()) {
				resultados.push(stmt.getAsObject());
			}
			stmt.free();

			return JSON.stringify(resultados, null, 2);
		} catch (err) {
			throw new Error(`A consulta de documentos falhou.`);
		}
	},
};

/**
 * ===================================================================================
 * INICIALIZAÇÃO E TESTES
 * ===================================================================================
 */
document.addEventListener("DOMContentLoaded", async () => {
	try {
		await DatabaseService.initialize();
		console.log("Banco de dados inicializado com sucesso. Rodando testes...");
		executarTestesRevisados();
	} catch (error) {
		console.error("Falha crítica na inicialização. A aplicação não pode continuar.", error);
	}
});

async function executarTestesRevisados() {
	console.log("\n--- INÍCIO DOS TESTES DE CONSULTA ---");

	// Teste 1: Caminho feliz
	try {
		console.log("\n[TESTE 1] Buscando documentos Municipais ('m') de 2023 em diante:");
		const resultadoJsonString = await DatabaseService.selecionarDocumentos("m", 2023);
		console.log(resultadoJsonString);
	} catch (error) {
		console.error("FALHA INESPERADA NO TESTE 1:", error.message);
	}

	// Teste 2: Caminho feliz
	try {
		console.log("\n[TESTE 2] Buscando todos os documentos Estaduais ('e'):");
		const resultadoJsonString = await DatabaseService.selecionarDocumentos("e");
		console.log(resultadoJsonString);
	} catch (error) {
		console.error("FALHA INESPERADA NO TESTE 2:", error.message);
	}

	// Teste 3: Caminho feliz
	try {
		console.log("\n[TESTE 3] Buscando documentos Federais ('f') de 2020 a 2022:");
		const resultadoJsonString = await DatabaseService.selecionarDocumentos("f", 2020, 2022);
		console.log(resultadoJsonString);
	} catch (error) {
		console.error("FALHA INESPERADA NO TESTE 3:", error.message);
	}

	// Teste 4: Teste de erro proposital para validar o catch
	try {
		console.log("\n[TESTE 4] Buscando com esfera inválida ('x') para testar o erro:");
		await DatabaseService.selecionarDocumentos("x");
	} catch (error) {
		console.log("SUCESSO NO TESTE 4: O erro foi capturado como esperado.");
		console.error("Mensagem do erro capturado:", error.message);
	}

	// Teste 5: Filtrando por tipo de documento
	try {
		console.log("\n[TESTE 5] Buscando documentos Municipais do tipo 'PPA':");
		const resultadoJsonString = await DatabaseService.selecionarDocumentos("m", null, null, "PPA");
		console.log(resultadoJsonString);
	} catch (error) {
		console.error("FALHA INESPERADA NO TESTE 5:", error.message);
	}

	console.log("\n--- FIM DOS TESTES DE CONSULTA ---");
}
