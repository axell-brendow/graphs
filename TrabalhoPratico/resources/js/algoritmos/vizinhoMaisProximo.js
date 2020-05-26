/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Aplica o algoritmo do vizinho mais próximo para encontrar um circuito hamiltoniano.
 *
 * @param {Aresta[][]} grafo Grafo onde o algoritmo deve ser rodado.
 * @param {number} verticeInicial
 * @param {number} delay Delay das iterações entre os vizinhos de um vértice.
 *
 * @return {Promise<Caminho[]>} Uma promessa que devolverá o caminho que representa
 * o circuito hamiltoniano encontrado.
 */
async function vizinhoMaisProximo(grafo, verticeInicial = 0, delay = 0) {
    vertices.forEach(vertice => vertice.resetar());
    // Começa um caminho com apenas um vértice.
    const caminho = new Caminho([verticeInicial], grafo);
    let ultimoVertice = verticeInicial; // Índice do último vértice adicionado ao caminho
    vertices[ultimoVertice].estado = ESTADO_FINAL;
    let caminhoValido = true;

    try {
        for (let i = 1; i < grafo.length; i++) {
            const verticeMaisProximo = await obterVerticeMaisProximo(
                vertices,
                arestas[ultimoVertice]
            );

            if (caminhoValido) {
                if (verticeMaisProximo == -1) caminhoValido = false;
                else {
                    caminho.adicionar(verticeMaisProximo);
                    caminho.destacarArestas();
                    ultimoVertice = verticeMaisProximo;
                    vertices[ultimoVertice].estado = ESTADO_FINAL;
                }
            }

            await new Promise((resolve, reject) => {
                setTimeout(resolve, delay);
            });
        }
    } finally {
        const circuitoFechado = caminho.podeSerCircuitoCompleto();

        if (circuitoFechado) {
            caminho.adicionar(verticeInicial);
            console.log("Hamiltonian circuit found!!!");
        }

        caminho.normalizarArestas();
    }
    return circuitoFechado ? caminho : null;
}
