/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Aplica o algoritmo do vizinho mais próximo para encontrar um circuito hamiltoniano.
 *
 * @param {Aresta[][]} grafo Grafo onde o algoritmo deve ser rodado.
 * @param {number} delay Delay das iterações entre os vizinhos de um vértice.
 *
 * @return {Promise<Caminho[]>} Uma promessa que devolverá o caminho que representa
 * o circuito hamiltoniano encontrado.
 */
async function forcaBrutaHamilton(grafo, delay = 0) {
    vertices.forEach(vertice => vertice.resetar());
    const arrayDeVertices = new Array(grafo.length).fill(null).map((v, i) => i);
    const caminho = new Caminho(arrayDeVertices, grafo);
    let melhorCaminho = null;

    caminho.permutarVertices((caminhoPermutado, numPermutacao) => {
        if (
            caminhoPermutado.existe() &&
            (melhorCaminho == null ||
                caminhoPermutado.peso < melhorCaminho.peso)
        )
            melhorCaminho = caminhoPermutado;

        return true;
    });

    return melhorCaminho != null && melhorCaminho.podeSerCircuitoCompleto()
        ? melhorCaminho.adicionar(0)
        : null;
}
