/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

let floydCaminhos;

/**
 * Cria uma nova matriz com os caminhos entre os vértices.
 * 
 * @param {Aresta[][]} grafo Matriz com as arestas do grafo.
 * 
 * @return {Caminho[][]}
 */
function criarCaminhos(grafo)
{
    return grafo.map(
        (arestasDoVertice) => arestasDoVertice.map(
            (aresta) => new Caminho(
                [aresta.indiceVerticeInicial, aresta.indiceVerticeFinal],
                grafo
            )
        )
    );
}

/**
 * Checa se o caminho existente entre inicio e fim pode ser substituído por um
 * caminho melhor que passa por inicio, meio e fim. Onde inicio, meio e fim
 * são os índices dos vértices no grafo.
 * 
 * @param {Caminho} caminhoSubstituido O último caminho que foi substituído por
 * um mais eficiente no algoritmo.
 * @param {Caminho} caminhoNovo O último caminho que substituiu outro mais
 * ineficiente.
 * @param {Caminho[][]} caminhos Matriz com os caminhos de todos os vértices para
 * todos os vértices.
 * @param {number} inicio Índice do vértice inicial do caminho existente.
 * @param {number} meio Índice do vértice do meio do possível novo caminho.
 * @param {number} fim Índice do vértice final do caminho existente.
 * @param {number} delay Delay a ser dado em caso de substituição de um caminho
 * pior por outro melhor.
 */
function nucleoFloyd(
    caminhoSubstituido, caminhoNovo, caminhos, inicio, meio, fim, delay,
    ultimoFim)
{
    let myDelay = 0;

    if (caminhoSubstituido != null)
    {
        caminhoSubstituido.normalizarArestas();
        caminhoNovo.normalizarArestas();
        vertices[ultimoFim].resetar();
    }

    let atual = caminhos[inicio][fim].peso;
    let inicioAoMeio = caminhos[inicio][meio].peso;
    let meioAoFim = caminhos[meio][fim].peso;

    if (inicioAoMeio + meioAoFim < atual)
    {
        caminhoSubstituido = caminhos[inicio][fim];

        caminhos[inicio][fim] =
            caminhos[inicio][meio].concatenarCom(caminhos[meio][fim]);

        caminhoNovo = caminhos[inicio][fim];

        caminhoSubstituido.destacarArestas("red");
        caminhoNovo.destacarArestas();
        vertices[fim].nomeDisplay = "fim";
        vertices[fim].cor = "#404040";
        myDelay = delay;
    }

    else
    {
        caminhoSubstituido = null;
        caminhoNovo = null;
    }

    // Checa se o vértice que foi o último vértice final de um caminho já está no
    // estado final, ou seja, se ele já foi o meio de todos os caminhos possíveis.
    if (ultimoFim < meio) vertices[ultimoFim].estado = ESTADO_FINAL;

    return [caminhoSubstituido, caminhoNovo, myDelay, fim];
}

/**
 * Aplica o algoritmo de Floyd Warshall no grafo para descobrir os menores caminhos
 * entre vértices do grafo.
 * 
 * @param {Aresta[][]} grafo Matriz com as arestas do grafo.
 * @param {number} delay Delay entre as iterações do algoritmo.
 * 
 * @return {Promise<Caminho[][]>}
 */
function floydWarshall(grafo, delay = 300)
{
    /** @type {Caminho} */
    let caminhoSubstituido;

    /** @type {Caminho} */
    let caminhoNovo;
    let myDelay, ultimoFim;

    arestas = grafo;
    vertices.forEach( (vertice) => vertice.resetar() );

    const caminhos = criarCaminhos(grafo);

    return new Promise(
        (resolve, reject) =>
        {
            forComPromise(0, grafo.length,
                (meio, resolveMeio) =>
                {
                    forComPromise(0, grafo.length,
                        (inicio, resolveInicio) =>
                        {
                            vertices[meio].nomeDisplay = "meio";
                            // vertices[meio].cor = "#404040";
                            vertices[meio].estado = ESTADO_INTERMEDIARIO;
        
                            forComDelay(0, grafo.length,
                                (fim) =>
                                {
                                    vertices[inicio].nomeDisplay = "inicio";
                                    vertices[inicio].cor = "#404040";
        
                                    [caminhoSubstituido, caminhoNovo, myDelay,
                                        ultimoFim] =
                                        nucleoFloyd(
                                            caminhoSubstituido, caminhoNovo,
                                            caminhos, inicio, meio, fim, delay,
                                            ultimoFim
                                        );

                                    return myDelay;
                                }
                            ).then(
                                () =>
                                {
                                    vertices[inicio].resetar();
                                    resolveInicio();
                                }
                            );
                        }
                    ).then(
                        () =>
                        {
                            vertices[meio].resetar();
                            vertices[meio].estado = ESTADO_FINAL;
                            resolveMeio();
                        }
                    );
                }
            ).then(
                () =>
                {
                    floydCaminhos = caminhos;
                    resolve(caminhos);
                }
            );
        }
    );
}

/**
 * Aplica o algoritmo de Floyd Warshall no grafo para descobrir os menores caminhos
 * entre vértices do grafo.
 * 
 * @param {Aresta[][]} grafo Matriz com as arestas do grafo.
 * 
 * @return {Promise<Caminho[][]>}
 */
/* function floydWarshall(grafo)
{
    let atual, inicioAoMeio, meioAoFim;
    const caminhos = criarCaminhos(grafo);

    vertices.forEach( (vertice) => vertice.resetar() );

    return new Promise(
        (resolve, reject) =>
        {
            for (let meio = 0; meio < grafo.length; meio++)
            {
                for (let inicio = 0; inicio < grafo.length; inicio++)
                {
                    for (let fim = 0; fim < grafo.length; fim++)
                    {
                        atual = caminhos[inicio][fim].peso;
                        inicioAoMeio = caminhos[inicio][meio].peso;
                        meioAoFim = caminhos[meio][fim].peso;
        
                        if (inicioAoMeio + meioAoFim < atual)
                        {
                            caminhos[inicio][fim] =
                            caminhos[inicio][meio].concatenarCom(caminhos[meio][fim]);
                        }
                    }
                }
            }

            floydCaminhos = caminhos;
            resolve(caminhos);
        }
    );
} */
