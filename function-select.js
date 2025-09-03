/**
 * ===================================================================================
 * ARQUIVO DE CONSULTAS AO BANCO DE DADOS (function-select.js)
 * ===================================================================================
 * Este arquivo é responsável por:
 * 1. Carregar o banco de dados 'banco.sqlite' usando a biblioteca sql.js.
 * 2. Fornecer um conjunto de funções para realizar consultas (SELECTs) no banco.
 * 3. Retornar os resultados dessas consultas em formato JSON.
 * ===================================================================================
 */

// Variável global que armazenará a instância do banco de dados após o carregamento.
let db;

/**
 * Função principal de configuração. Ela carrega o arquivo .sqlite e o prepara para uso.
 */
async function configurarBancoDeDados() {
	try {
		const SQL = await initSqlJs({
			locateFile: (file) => `/_database/${file}`,
		});
		const response = await fetch("/_database/banco.sqlite");
		if (!response.ok) {
			console.error(
				`Erro ao buscar o banco de dados. Status: ${response.status} ${response.statusText}`
			);
			return;
		}
		const buffer = await response.arrayBuffer();
		db = new SQL.Database(new Uint8Array(buffer));

		console.log("BANCO DE DADOS CARREGADO E PRONTO PARA USO.");
		await executarTestesDeConsulta();
	} catch (err) {
		console.error("ERRO GRAVE AO CONFIGURAR O BANCO DE DADOS:", err);
	}
}

/**
 * ===================================================================================
 * BIBLIOTECA DE FUNÇÕES DE SELECT
 * ===================================================================================
 * Funções reutilizáveis para consultar o banco de dados. Construída com JOINS
 * para substituir as chaves estrangeiras pelos seus valores correspondentes.
 * ===================================================================================
 */

/**
 * Busca todos os documentos, substituindo as chaves estrangeiras pelos seus valores nominais.
 * @returns {string} Uma string JSON com a lista de todos os documentos e seus dados associados.
 */
function selecionarTodosDocumentos() {
	if (!db) {
		console.error("O banco de dados não foi inicializado.");
		return "[]";
	}
	try {
		const query = `
        SELECT 
            D.id,
            D.dado,
            D.ano,
            TD.nome AS TipoDocumento,  -- Busca o nome do TipoDocumento
            PC.nome AS PalavraChave    -- Busca o nome da PalavraChave
        FROM 
            Documento AS D
        LEFT JOIN 
            TipoDocumento AS TD ON D.idTipoDocumento = TD.id
        LEFT JOIN 
            PalavraChave AS PC ON D.idPalavraChave = PC.id
    `;
		const resultado = db.exec(query);

		if (resultado.length === 0) {
			return "[]";
		}

		const colunas = resultado[0].columns;
		const valores = resultado[0].values;
		const listaDeObjetos = valores.map((linha) => {
			const obj = {};
			colunas.forEach((coluna, i) => {
				obj[coluna] = linha[i];
			});
			return obj;
		});

		return JSON.stringify(listaDeObjetos, null, 2);
	} catch (err) {
		console.error("Erro ao executar SELECT na tabela Documento:", err);
		return "[]";
	}
}

/**
 * Busca um documento específico pelo seu ID, já com as chaves estrangeiras resolvidas.
 * @param {number} id O ID do documento a ser buscado.
 * @returns {string} Uma string JSON com o documento encontrado.
 */
function selecionarDocumentoPorId(id) {
	if (!db) {
		console.error("O banco de dados não foi inicializado.");
		return "{}";
	}
	try {
		const query = `
        SELECT 
            D.id,
            D.dado,
            D.ano,
            TD.nome AS TipoDocumento,
            PC.nome AS PalavraChave
        FROM 
            Documento AS D
        LEFT JOIN 
            TipoDocumento AS TD ON D.idTipoDocumento = TD.id
        LEFT JOIN 
            PalavraChave AS PC ON D.idPalavraChave = PC.id
        WHERE 
            D.id = :id
    `;
		const stmt = db.prepare(query);
		const resultado = stmt.getAsObject({ ":id": id });
		stmt.free();

		return JSON.stringify(resultado || {}, null, 2);
	} catch (err) {
		console.error("Erro ao executar SELECT por ID na tabela Documento:", err);
		return "{}";
	}
}

/**
 * Busca documentos filtrando pelo NOME do tipo, retornando também a Palavra-Chave.
 * @param {string} nomeTipo O nome (ou parte do nome) do tipo de documento.
 * @returns {string} JSON com a lista de documentos encontrados.
 */
function selecionarDocumentosPorNomeDoTipo(nomeTipo) {
	if (!db) {
		console.error("O banco de dados não foi inicializado.");
		return "[]";
	}
	try {
		const query = `
        SELECT 
            D.id,
            D.dado,
            D.ano,
            TD.nome AS TipoDocumento,
            PC.nome AS PalavraChave
        FROM 
            Documento AS D
        LEFT JOIN 
            TipoDocumento AS TD ON D.idTipoDocumento = TD.id
        LEFT JOIN 
            PalavraChave AS PC ON D.idPalavraChave = PC.id
        WHERE 
            TD.nome LIKE :nomeTipo
    `;

		const stmt = db.prepare(query);
		stmt.bind({ ":nomeTipo": `%${nomeTipo}%` });

		const resultados = [];
		while (stmt.step()) {
			resultados.push(stmt.getAsObject());
		}
		stmt.free();

		return JSON.stringify(resultados, null, 2);
	} catch (err) {
		console.error("Erro ao executar SELECT com JOIN por nome de tipo:", err);
		return "[]";
	}
}

/**
 * Busca documentos com filtros combinados de esfera, agenda, tipo e período.
 *
 * @param {object} filtros O objeto com os filtros a serem aplicados.
 * @param {string} [filtros.esfera] A esfera do documento ('Estadual', 'Federal', 'Municipal').
 * @param {string} [filtros.agenda] A agenda/poder do documento ('Executivo', 'Legislativo', 'Judiciario').
 * @param {string} [filtros.tipoDocumento] O nome do tipo de documento ('LOA', 'LDO', etc.).
 * @param {number} [filtros.anoInicio] O ano de início do período.
 * @param {number} [filtros.anoFim] O ano de fim do período.
 * @returns {string} Uma string JSON com a lista de documentos encontrados.
 */
function selecionarDocumentosComFiltros(filtros = {}) {
	
	try {
		const {
			esfera,
			agenda,
			tipoDocumento,
			anoInicio, 
			anoFim, 
		} = filtros;

		let query = `
      SELECT
        D.id,
        D.dado,
        D.ano,
        TD.nome AS TipoDocumento,
        PC.nome AS PalavraChave,
        CASE
          WHEN DE.idDocumento IS NOT NULL THEN 'Estadual'
          WHEN DM.idDocumento IS NOT NULL THEN 'Municipal'
          ELSE 'Federal'
        END AS Esfera,
        CASE
          WHEN PC.nome LIKE 'Poder Executivo' THEN 'Executivo'
          WHEN PC.nome LIKE 'Poder Legislativo' THEN 'Legislativo'
          WHEN PC.nome LIKE 'Poder Judiciario' THEN 'Judiciario'
          ELSE NULL
        END AS Agenda
      FROM
        Documento AS D
      LEFT JOIN TipoDocumento AS TD ON D.idTipoDocumento = TD.id
      LEFT JOIN PalavraChave AS PC ON D.idPalavraChave = PC.id
      LEFT JOIN DocumentoEstadual AS DE ON D.id = DE.idDocumento
      LEFT JOIN DocumentoMunicipal AS DM ON D.id = DM.idDocumento
    `;

		const conditions = [];
		const params = {};
	
		// Agora a condição usa a coluna 'ano' para o filtro de período.
		if (anoInicio && anoFim) {
			conditions.push(`D.ano BETWEEN :anoInicio AND :anoFim`);
			params[":anoInicio"] = anoInicio;
			params[":anoFim"] = anoFim;
		} else if (anoInicio) {
			conditions.push(`D.ano >= :anoInicio`);
			params[":anoInicio"] = anoInicio;
		} else if (anoFim) {
			conditions.push(`D.ano <= :anoFim`);
			params[":anoFim"] = anoFim;
		}

		if (conditions.length > 0) {
			query += ` WHERE ${conditions.join(" AND ")}`;
		}

		const stmt = db.prepare(query);
		stmt.bind(params);

		const resultados = [];
		while (stmt.step()) {
			resultados.push(stmt.getAsObject());
		}
		stmt.free();

		return JSON.stringify(resultados, null, 2);
	} catch (err) {
		console.error("Erro ao executar SELECT com filtros combinados:", err);
		return "[]";
	}
}

/**
 * ===================================================================================
 * ÁREA DE TESTES
 * ===================================================================================
 * Esta função pode ser modificada ou removida completamente no futuro.
 * ===================================================================================
 */
/**
 * ===================================================================================
 * ÁREA DE TESTES
 * ===================================================================================
 */

function executarTestesDeConsulta() {
	console.log("\n--- INÍCIO DOS TESTES DE CONSULTA ---");

	// Teste 1: Buscar todos os documentos.
	console.log("\n[TESTE 1] Resultado de selecionarTodosDocumentos():");
	const jsonTodosDocumentos = selecionarTodosDocumentos();
	console.log(jsonTodosDocumentos);

	// Teste 2: Buscar um documento específico.
	console.log("\n[TESTE 2] Resultado de selecionarDocumentoPorId(3):");
	const jsonDocumento1 = selecionarDocumentoPorId(3);
	console.log(jsonDocumento1);

	// Teste 3: Buscar por tipo "Portaria".
	console.log("\n[TESTE 3] Buscando todos os documentos do tipo 'Portaria':");
	const jsonLeis = selecionarDocumentosPorNomeDoTipo("Portaria");
	console.log(jsonLeis);

	// Teste 4: Buscar por tipo "Decreto".
	console.log("\n[TESTE 4] Buscando todos os documentos do tipo 'Decreto':");
	const jsonDecretos = selecionarDocumentosPorNomeDoTipo("Decreto");
	console.log(jsonDecretos);

	// --- FILTROS ---

	// Teste 5: Filtrar por Esfera Federal e tipo 'LOA'
	console.log("\n[TESTE 5] Buscando documentos Federais do tipo 'LOA':");
	const filtrosFederaisLOA = selecionarDocumentosComFiltros({
		esfera: "Federal",
		tipoDocumento: "LOA",
	});
	console.log(filtrosFederaisLOA);

	// ...
	// Teste 6: Buscando documentos de 2015 a 2023.
	// Use as colunas 'anoInicio' e 'anoFim' e passe anos como números.
	console.log("\n[TESTE 6] Buscando documentos de 2015 a 2023:");
	const filtrosPorAno = selecionarDocumentosComFiltros({
		anoInicio: 2019,
		anoFim: 2023,
	});
	console.log(filtrosPorAno);
	// ...

	// Teste 7: Filtrar por Agenda 'Executivo' e Esfera 'Estadual'
	console.log("\n[TESTE 7] Buscando documentos do Poder Executivo Estadual:");
	const filtrosExecutivoEstadual = selecionarDocumentosComFiltros({
		esfera: "Estadual",
		agenda: "Executivo",
	});
	console.log(filtrosExecutivoEstadual);

	// Teste 8: Filtrar por todos os critérios combinados
	console.log(
		"\n[TESTE 8] Buscando documentos Municipais, Poder Legislativo, tipo 'LOA', de 2024:"
	);
	const filtrosCombinados = selecionarDocumentosComFiltros({
		esfera: "Municipal",
		agenda: "Legislativo",
		tipoDocumento: "LOA",
		dataInicio: "2023",
		dataFim: "2024",
	});
	console.log(filtrosCombinados);

	console.log("\n--- FIM DOS TESTES DE CONSULTA ---");
}

/**
 * ===================================================================================
 * INICIALIZAÇÃO
 * ===================================================================================
 */

configurarBancoDeDados();