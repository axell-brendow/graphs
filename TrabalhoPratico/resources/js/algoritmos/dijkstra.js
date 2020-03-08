/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

let dijkstraCaminhos;
let dijkstraPesos;

/**
 * Percorre a listaDeIteracao ignorando os índices onde o vértice equivalente na
 * lista de vértices não está no ESTADO_INICIAL (branco). Para cada índice não
 * ignorado, roda a funcaoDeManipulacao passando o índice e o elemento no índice.
 * 
 * Ex.: vertices = [ {"estado":null}, {"estado":ESTADO_INICIAL},
 * {"estado":ESTADO_INTERMEDIARIO} ]
 * 
 * listaDeIteracao = [10, 9, 8]
 * 
 * funcaoDeManipulacao = (indice, numero) => console.log(indice, numero);
 * 
 * percorrerVerticesNaoVisitados(vertices, listaDeIteracao, funcaoDeManipulacao);
 * 
 * Saída:
 * 1 9
 * 
 * @param {Vertice[]} vertices Lista de vértices de um grafo.
 * @param {any[]} listaDeIteracao Lista de interesse a ser iterada.
 * @param {(indice: number, any) => void} funcaoDeManipulacao Função a ser
 * aplicada para cada índice não ignorado da lista.
 * @param {number} delay Delay, em milisegundos, entre cada iteração.
 */
function percorrerVerticesNaoVisitados(
    vertices, listaDeIteracao, funcaoDeManipulacao, delay = 0)
{
    return new Promise(
        (resolve, reject) =>
        {
            let i = 0;

            function iterar()
            {
                if (i < listaDeIteracao.length)
                {
                    if (vertices[i].estado == ESTADO_INICIAL)
                    {
                        const elemento = listaDeIteracao[i];
                        funcaoDeManipulacao(i, elemento);
                    }

                    i++;
                    setTimeout(iterar, delay);
                }

                else resolve();
            }

            iterar();
        }
    );
}

/**
 * Com base nos pesos dos caminhos começando num vértice inicial,
 * descobre o índice do vértice final cujo caminho é menos custoso.
 * Ignora vértices que já tenham sido visitados.
 * 
 * @param {Vertice[]} vertices Lista de vértices do grafo.
 * @param {Caminho[]|Aresta[]} caminhos Lista dos caminhos do vértice inicial aos demais.
 * 
 * @return {Promise<number>} -1 caso todos os vértices do grafo tenham sido
 * percorridos. Caso contrário, o índice do vértice cujo caminho é menos custoso.
 */
function obterVerticeMaisProximo(vertices, caminhos)
{
    let indice = -1;
    let menorPeso = Infinity;

    return new Promise(
        (resolve, reject) =>
        {
            percorrerVerticesNaoVisitados(vertices, caminhos,
                (i, caminho) =>
                {
                    if (caminho.peso < menorPeso)
                    {
                        menorPeso = caminho.peso;
                        indice = i;
                    }
                }
            ).then((v) => resolve(indice));
        }
    );
}

/**
 * Faz as inicializações do algoritmo de dijkstra. Obtém as arestas ligadas ao
 * vértice inicial, os custos delas e cria o vetor de caminhos do vértice inicial
 * aos demais.
 * 
 * @param {Aresta[][]} grafo Grafo onde o algoritmo deve ser rodado.
 * @param {number} indiceVerticeInicial Índice do vértice inicial de busca em
 * relação ao arranjo global de vértices.
 * 
 * @return {Caminho[]}
 */
function inicializarDijkstra(grafo, indiceVerticeInicial)
{
    arestas = grafo; // Coloca o grafo recebido como o grafo a ser renderizado

    let arestasVerticeInicial = grafo[indiceVerticeInicial];

    let caminhos = arestasVerticeInicial.map(
        (aresta, indice) =>
        {
            let caminho = new Caminho();

            if (aresta.peso != ARESTA_PESO_PADRAO)
            {
                caminho = new Caminho([indiceVerticeInicial, indice], grafo);
            }

            return caminho;
        }
    );

    vertices.forEach( (vertice) => vertice.resetar() );

    return caminhos;
}

/**
 * Checa se o comprimento do caminho do vértice inicial ao vértice mais próximo não
 * visitado mais a aresta deste ao vértice final é menor que o comprimento do caminho
 * existente entre o vértice inicial e o final.
 * 
 * @param {number} indiceVerticeFinal Índice do vértice final do caminho.
 * @param {Aresta} aresta Aresta entre o vértice mais próximo e o vértice final.
 * @param {number} indVerticeMaisProximo Índice do vértice não visitado mais próximo
 * do vértice inicial.
 * @param {Caminho[]} caminhos Caminhos do vértice inicial aos demais.
 * @param {Caminho} caminhoSubstituido O último caminho que foi substituído por
 * um mais eficiente no algoritmo.
 * @param {Caminho} caminhoNovo O último caminho que substituiu outro mais
 * ineficiente.
 * 
 * @return {[string, number]}
 */
function nucleoDijkstra(
    indiceVerticeFinal, aresta, indVerticeMaisProximo,
    caminhos, caminhoSubstituido, caminhoNovo)
{
    let copiaCorBorda = vertices[indiceVerticeFinal].corBorda;
    let copiaTamanhoBorda = vertices[indiceVerticeFinal].tamanhoBorda;
    vertices[indiceVerticeFinal].corBorda = VERTICE_BORDA_DESTAQUE_COR_PADRAO;
    vertices[indiceVerticeFinal].tamanhoBorda = VERTICE_BORDA_DESTAQUE_TAMANHO_PADRAO;

    if (caminhoSubstituido != null)
    {
        caminhoSubstituido.normalizarArestas();
        caminhoNovo.normalizarArestas();
    }

    /** Peso do caminho entre o vértice inicial e o vértice
    mais próximo não visitado */
    const pesoDoInicialAoMaisProx = caminhos[indVerticeMaisProximo].peso;
    /** Peso do caminho entre o vértice inicial e o vértice final */
    const pesoDoInicialAoFinal = caminhos[indiceVerticeFinal].peso;

    if (pesoDoInicialAoMaisProx + aresta.peso < pesoDoInicialAoFinal)
    {
        caminhoSubstituido = caminhos[indiceVerticeFinal].clonar();
        caminhoNovo = caminhos[indVerticeMaisProximo].clonar();
        // caminhos[indiceVerticeFinal].peso = pesoDoInicialAoMaisProx + aresta.peso;
        caminhos[indiceVerticeFinal] = caminhoNovo.adicionar(indiceVerticeFinal);
        caminhoSubstituido.destacarArestas("red");
        caminhoNovo.destacarArestas();
    }

    else
    {
        caminhoSubstituido = null;
        caminhoNovo = null;
    }

    return [copiaCorBorda, copiaTamanhoBorda, indiceVerticeFinal,
        caminhoSubstituido, caminhoNovo];
}

/**
 * Coloca o vértice não visitado mais próximo do vértice inicial no estado
 * intermediário, obtém as arestas dele, caminha pelas arestas que ligam a vértices
 * não visitados e decide se é melhor o caminho que passa por essas arestas ou o já
 * existente. Então, coloca o vértice no estado final, volta a procurar o vértice
 * mais próximo do vértice inicial e repete o processo.
 * 
 * @param {number} indVerticeMaisProximo Índice do vértice não visitado mais próximo
 * do vértice inicial.
 * @param {Aresta[][]} grafo Grafo do algoritmo de Dijkstra.
 * @param {string} copiaCorBorda Cópia da cor da borda do vértice da iteração
 * anterior.
 * @param {number} copiaTamanhoBorda Cópia do tamanho da borda do vértice da iteração
 * anterior.
 * @param {number} ultimoIndice Índice do vértice da último iteração.
 * @param {Caminho[]} caminhos Caminhos do vértice inicial aos demais.
 * @param {number} delay Delay entre as iterações sobre as arestas do vértice não
 * visitado mais próximo do vértice inicial.
 * @param {() => void} iterarPelosVertices Função de callback a ser chamada no
 * final desta.
 * 
 * @return {Promise<[string, number, number, number]>}
 */
function percorrerArestasEReiniciarProcesso(
    indVerticeMaisProximo, grafo, copiaCorBorda,
    copiaTamanhoBorda, ultimoIndice, caminhos,
    delay, iterarPelosVertices)
{
    vertices[indVerticeMaisProximo].estado = ESTADO_INTERMEDIARIO;
    let arestasDoVertice = grafo[indVerticeMaisProximo];
    let caminhoSubstituido, caminhoNovo;

    return new Promise(
        (resolve, reject) =>
        {
            percorrerVerticesNaoVisitados(vertices, arestasDoVertice,
                (indice, aresta) =>
                {
                    if (copiaCorBorda && ultimoIndice > -1)
                    {
                        vertices[ultimoIndice].corBorda = copiaCorBorda;
                        vertices[ultimoIndice].tamanhoBorda = copiaTamanhoBorda;
                    }
                    if (aresta.peso != ARESTA_PESO_PADRAO)
                    {
                        [copiaCorBorda, copiaTamanhoBorda, ultimoIndice,
                            caminhoSubstituido, caminhoNovo] =
                            nucleoDijkstra(indice, aresta,
                                indVerticeMaisProximo, caminhos,
                                caminhoSubstituido, caminhoNovo);
                    }
                },
                delay
            ).then(
                () =>
                {
                    if (caminhoSubstituido != null)
                    {
                        caminhoSubstituido.normalizarArestas();
                        caminhoNovo.normalizarArestas();
                    }
                    vertices[indVerticeMaisProximo].estado = ESTADO_FINAL;
                    
                    obterVerticeMaisProximo(vertices, caminhos).then(
                        (indice) =>
                        {
                            indVerticeMaisProximo = indice;

                            resolve(
                                [copiaCorBorda, copiaTamanhoBorda,
                                ultimoIndice, indVerticeMaisProximo]);

                            setTimeout(iterarPelosVertices, 0);
                        }
                    );
                }
            );
        }
    )
}

/**
 * Aplica o algoritmo de dijkstra nos dois vértices recebidos.
 * 
 * @param {Aresta[][]} grafo Grafo onde o algoritmo deve ser rodado.
 * @param {number} indiceVerticeInicial Índice do vértice inicial de busca em
 * relação ao arranjo global de vértices.
 * @param {number} indiceVerticeFinal Índice do vértice final de busca em
 * relação ao arranjo global de vértices.
 * @param {number} delay Delay das iterações entre os vizinhos de um vértice.
 * 
 * @return {Promise<Caminho[]>} Uma promessa que devolverá um arranjo de caminhos
 * em relação ao vértice inicial.
 */
function dijkstra(
    grafo, indiceVerticeInicial, indiceVerticeFinal = Infinity, delay = 10)
{
    let caminhos = inicializarDijkstra(grafo, indiceVerticeInicial);
    let copiaCorBorda, copiaTamanhoBorda, ultimoIndice;

    return new Promise(
        (resolve, reject) =>
        {
            let indVerticeMaisProximo = indiceVerticeInicial;
            vertices[indVerticeMaisProximo].estado = ESTADO_FINAL;

            function iterarPelosVertices()
            {
                if (indVerticeMaisProximo != -1 &&
                    indVerticeMaisProximo != indiceVerticeFinal)
                {
                    percorrerArestasEReiniciarProcesso(
                        indVerticeMaisProximo, grafo, copiaCorBorda,
                        copiaTamanhoBorda, ultimoIndice, caminhos,
                        delay, iterarPelosVertices
                    ).then(
                        (valores) => [copiaCorBorda, copiaTamanhoBorda,
                            ultimoIndice, indVerticeMaisProximo] = valores
                    );
                }
        
                else
                {
                    if (copiaCorBorda && ultimoIndice > -1)
                    {
                        vertices[ultimoIndice].corBorda = copiaCorBorda;
                        vertices[ultimoIndice].tamanhoBorda = copiaTamanhoBorda;
                    }
                    dijkstraCaminhos = caminhos;
                    resolve(caminhos);
                }
            }

            obterVerticeMaisProximo(vertices, caminhos).then(
                (indice) =>
                {
                    indVerticeMaisProximo = indice;
                    iterarPelosVertices();
                }
            );
        }
    );
}
