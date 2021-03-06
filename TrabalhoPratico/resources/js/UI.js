/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Gerencia eventos de UserInterface (interação com o usuário).
 */

let verticesSelecionados = [];
let selecionarVertices = false;
let intervalId;

function mouseMove(event) {
    console.log(event);
}

function mouseDown(event) {
    // let indiceDoVerticeClicado = vertices.map(
    //     (vertice) => estaDentroDoCirculo(
    //             vertice.cx, vertice.cy, vertice.raio, event.clientX, event.clientY)
    // ).indexOf(true); // Encontra o índice do primeiro vértice que atendeu à condição.

    let indiceDoVerticeClicado = vertices.findIndex(vertice =>
        estaDentroDoCirculo(
            vertice.cx,
            vertice.cy,
            vertice.raio,
            event.clientX,
            event.clientY
        )
    );

    if (selecionarVertices && indiceDoVerticeClicado != -1) {
        verticesSelecionados.push(indiceDoVerticeClicado);
    }

    console.log(
        "indice:",
        indiceDoVerticeClicado,
        vertices[indiceDoVerticeClicado]
    );
    console.log(
        `x: ${event.clientX}, y: ${event.clientY},` +
            ` x%: ${event.clientX / largura}, y%: ${event.clientY / altura},` +
            ` width: ${largura}, height: ${altura}`
    );
}

function mouseUp(event) {
    console.log(event);
}

/**
 * Solicita ao usuário que clique em dois vértices e espera até que isso seja feito.
 *
 * @return {Promise<number[]>} Promessa onde o método then receberá o arranjo de
 * índices dos vértices selecionados pelo usuário.
 */
async function selecionar2Vertices() {
    verticesSelecionados = [];

    if (!selecionarVertices) {
        alert("Clique em dois vértices");
        verticesSelecionados = [];
        selecionarVertices = true;

        // Checa se dois vértices foram selecionados
        while (verticesSelecionados.length < 2) {
            await new Promise((resolve, reject) => {
                setTimeout(resolve, 200);
            });
        }
        selecionarVertices = false;
    }

    return verticesSelecionados;
}

function iniciarLoading() {
    const barra = $(".navbar-brand");
    const textoBarra = barra.text();
    const delay = 200;
    const animar = () => {
        setTimeout(() => barra.text(textoBarra + "."), delay * 0);
        setTimeout(() => barra.text(textoBarra + ".."), delay * 1);
        setTimeout(() => barra.text(textoBarra + "..."), delay * 2);
        setTimeout(() => barra.text(textoBarra + "...."), delay * 3);
        setTimeout(() => barra.text(textoBarra + "....."), delay * 4);
        setTimeout(() => barra.text(textoBarra + "......"), delay * 5);
        setTimeout(() => barra.text(textoBarra + "......."), delay * 6);
        setTimeout(() => barra.text(textoBarra), delay * 7);
    };

    animar();
    return (intervalId = setInterval(animar, delay * 8));
}

function terminarLoading() {
    clearInterval(intervalId);
}

/**
 * Faz uma animação com uma seta passeando pelo caminho recebido.
 *
 * @param {Caminho} caminho
 * @param {number} num Números vezes que a seta fará o caminho.
 */
async function caminharNVezes(caminho, num = 3) {
    caminho.destacarArestas();

    for (let i = 0; i < num; i++) {
        await caminho.caminhar();
    }

    caminho.normalizarArestas();
}

async function menorPesoEntre2Vertices(grafo) {
    desrenderizarTodasArestas();
    arestas = grafo;

    const vertices = await selecionar2Vertices();
    iniciarLoading();

    medirTempo(dijkstra, caminhos => {
        // vertices[1] retorna o índice do vértice destino,
        // daí eu acesso o caminho até ele
        caminharNVezes(caminhos[vertices[1]]);
        console.log(caminhos, "##############");
        terminarLoading();
    })(grafo, ...vertices);
    // ...Spread operator
}

/**
 * Solicita ao usuário para selecionar dois vértices do grafo e então chama
 * o algoritmo de Dijkstra nesses dois vértices.
 */
function menorCaminho2() {
    menorPesoEntre2Vertices(grafoDistancias);
}

/**
 * Solicita ao usuário para selecionar dois vértices do grafo e então chama
 * o algoritmo de Dijkstra nesses dois vértices.
 */
function menorTarifa2() {
    menorPesoEntre2Vertices(grafoPrecos);
}

/**
 * Roda o algoritmo de Floyd Warshall no grafo dos preços.
 */
function qualquerLugar() {
    desrenderizarTodasArestas();
    iniciarLoading();

    medirTempo(floydWarshall, caminhos => {
        console.log(caminhos);
        terminarLoading();
    })(grafoPrecos);
}

function printarMelhorCircuito(melhorCaminho) {
    if (melhorCaminho != null) {
        const primeiroVertice = melhorCaminho.obterVertice(0);
        const ultimoVertice = melhorCaminho.obterVertice(
            melhorCaminho.numVertices() - 2
        );

        console.log(`Start -> ${vertices[primeiroVertice].nomeDisplay}:${primeiroVertice},
End -> ${vertices[ultimoVertice].nomeDisplay}:${ultimoVertice},
Hamiltonian graph!!`);

        console.log(melhorCaminho);

        melhorCaminho.indicesDosVertices.forEach(
            indice => (vertices[indice].estado = ESTADO_FINAL)
        );
        caminharNVezes(melhorCaminho);
    } else console.log("Non hamiltonian graph!!");
}

/**
 * Roda o algoritmo de força bruta para encontrar um circuito hamiltoniano de viagens.
 */
async function viagemAoRedorDoMundo() {
    desrenderizarTodasArestas();
    iniciarLoading();
    try {
        const melhorCaminho = await forcaBrutaHamilton(grafoPrecos);
        printarMelhorCircuito(melhorCaminho);
    } finally {
        terminarLoading();
    }
}

/**
 * Roda o algoritmo do vizinho mais próximo no grafo das tarifas para encontrar
 * um circuito hamiltoniano de viagens.
 */
async function viagemAoRedorDoMundoHeuristica() {
    let melhorCaminho = null;

    desrenderizarTodasArestas();
    iniciarLoading();

    try {
        for (let i = 0; i < grafoDistancias.length; i++) {
            await medirTempo(vizinhoMaisProximo, caminho => {
                if (melhorCaminho == null) melhorCaminho = caminho;

                if (caminho != null && caminho.peso < melhorCaminho.peso)
                    melhorCaminho = caminho;
            })(grafoPrecos, i);
        }
    } finally {
        terminarLoading();
        printarMelhorCircuito(melhorCaminho);
    }
}

$(
    // Só roda quando o documento for carregado
    () => {
        // $('#canvas').on('mousemove', mouseMove);
        $("#canvas").on("mousedown", mouseDown);
        // $('#canvas').on('mouseup', mouseUp);

        $("#btn-menor-caminho-2").click(menorCaminho2);
        $("#btn-menor-tarifa-2").click(menorTarifa2);
        $("#btn-viagem-ao-redor").click(viagemAoRedorDoMundo);
        $("#btn-viagem-ao-redor-heuristica").click(
            viagemAoRedorDoMundoHeuristica
        );
        $("#btn-qualquer-lugar").click(qualquerLugar);
        // $('#btn-alturas-de-voo').click(checarAlturasDeVoo);
    }
);
