/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Arquivo que guarda as estruturas de dados e algoritmos de grafos
 */

let VERTICE_RAIO_PADRAO = 15;
let VERTICE_COR_PADRAO = "white";
let VERTICE_COR_TEXTO_PADRAO = "#00e60c";
let VERTICE_BORDA_COR_PADRAO = "#484b5c";
let VERTICE_DESTAQUE_COR_PADRAO = "#AA00FF";
let VERTICE_BORDA_DESTAQUE_COR_PADRAO = "black";
let VERTICE_BORDA_DESTAQUE_TAMANHO_PADRAO = 4;

let ARESTA_PESO_PADRAO = Infinity;
let ARESTA_COR_PADRAO = "black";
let ARESTA_COR_ATIVADA = "green";
let ARESTA_COR_TEXTO_PADRAO = "black";
let ARESTA_LARGURA_PADRAO = 1;
let ARESTA_LARGURA_ATIVADA = 3;

let ESTADO_INICIAL = "white";
let ESTADO_INTERMEDIARIO = "gray";
let ESTADO_FINAL = "black";

/**
 * Cria vértices com posições aleatórias no vetor global apenas para teste.
 * 
 * @param {number} larguraCanvas Largura do contexto de desenho.
 * @param {number} alturaCanvas Altura do contexto de desenho.
 * @param {number} numVertices Número de vértices a serem criados.
 *
 * @return {Vertice[]} Vértices gerados.
 */
function criarVerticesAleatorios(larguraCanvas, alturaCanvas, numVertices = 8)
{
    let cx = 0, cy = 0, raio = VERTICE_RAIO_PADRAO;
    const vertices = [];

    for (let index = 0; index < numVertices; index++)
    {
        cx = Math.random() * larguraCanvas;
        cy = Math.random() * alturaCanvas;

        while (cx < raio * 3 || cx > larguraCanvas - raio * 3)
            cx = Math.random() * larguraCanvas;

        while (cy < raio * 3 || cy > alturaCanvas - raio * 3)
            cy = Math.random() * alturaCanvas;

        vertices.push(new Vertice('' + index, cx, cy));
    }

    return vertices;
}

function criarArestasAleatorias(numVertices)
{
    const arestas = iniciarArestas(numVertices);
    let randNum = 0.0;

    for (let i = 0; i < numVertices; i++)
    {
        for (let j = 0; j < numVertices; j++)
        {
            if (i !== j) // Ignora auto loops
            {
                randNum = Math.random();

                // Coloca um peso aleatório nas arestas com 20% de chance
                if (randNum * 100 < 20)
                    arestas[i][j].peso = arestas[j][i].peso = parseInt(50 + 1000 * randNum);
            }
        }

        if (i > 0)
        {
            // Cria arestas entre o vértice no índice 0 e todos os outros
            arestas[0][i].peso = arestas[i][0].peso = parseInt(50 + 1000 * Math.random());
            // Cria aresta entre os vértices nos índices (0, 1), (1, 2), (2, 3), ...
            arestas[i - 1][i].peso = arestas[i][i - 1].peso = parseInt(50 + 1000 * Math.random());
        }
    }

    return arestas;
}

class Vertice
{
    /**
     * @param {string} nome Nome do vértice. Esse nome será desenhado no centro
     * do vértice.
     * @param {number} cx Abscissa do centro do vértice.
     * @param {number} cy Ordenada do centro do vértice.
     * @param {string} estado Estado do vértice (inicial, intermediário, final).
     * @param {string} cor Cor de preenchimento da círculo do vértice.
     * @param {number} raio Raio do círculo.
     * @param {string} corTexto Cor do nome do vértice.
     * @param {string} corBorda Cor da borda do círculo.
     * @param {number} tamanhoBorda Tamanho da borda do círculo.
     */
    constructor(
        nome, cx, cy, estado = ESTADO_INICIAL, cor = VERTICE_COR_PADRAO,
        raio = VERTICE_RAIO_PADRAO, corTexto = VERTICE_COR_TEXTO_PADRAO,
        corBorda = VERTICE_BORDA_COR_PADRAO, tamanhoBorda = null)
    {
        this.nome = nome;
        this.nomeDisplay = nome;
        this.cx = Math.floor(cx); // Ajuda na performance arredondar
        this.cy = Math.floor(cy); // Ajuda na performance arredondar
        this._estado = estado;
        this.cor = cor;
        this.raio = raio;
        this.corBorda = corBorda;
        this.corTexto = corTexto;
        this.tamanhoBorda = tamanhoBorda;
        
        this.resetar = this.resetar.bind(this);
        this.renderizar = this.renderizar.bind(this);
        this.destacar = this.destacar.bind(this);
    }

    get estado() { return this._estado; }

    /**
     * @param {string} estado Estado do vértice (inicial, intermediário, final).
     */
    set estado(estado)
    {
        this._estado = estado;
        this.cor = estado;
    }

    resetar()
    {
        this.nomeDisplay = this.nome;
        this.estado = ESTADO_INICIAL;
        this.raio = VERTICE_RAIO_PADRAO;
        this.corTexto = VERTICE_COR_TEXTO_PADRAO;
        this.corBorda = VERTICE_BORDA_COR_PADRAO;
        this.tamanhoBorda = null;
    }

    renderizar(context)
    {
        circulo(context,
            this.cx,
            this.cy,
            this.raio,
            this.cor,
            this.corBorda,
            this.tamanhoBorda);

        textoCentro(context, this.nomeDisplay, this.cx, this.cy, this.corTexto);
    }

    destacar(nomeDisplay = dictSiglas[this.nome],
             cor = VERTICE_DESTAQUE_COR_PADRAO,
             corBorda = VERTICE_BORDA_DESTAQUE_COR_PADRAO,
             tamanhoBorda = VERTICE_BORDA_DESTAQUE_TAMANHO_PADRAO)
    {
        const copiaNome = this.nomeDisplay;
        const copiaCor = this.cor;
        const copiaCorBorda = this.corBorda;
        const copiaTamanhoBorda = this.tamanhoBorda;

        this.nomeDisplay = nomeDisplay;
        this.cor = cor;
        this.corBorda = corBorda;
        this.tamanhoBorda = tamanhoBorda;

        setTimeout(
            () =>
            {
                this.nomeDisplay = copiaNome;
                this.cor = copiaCor;
                this.corBorda = copiaCorBorda;
                this.tamanhoBorda = copiaTamanhoBorda;
            },
            5000
        );
    }
}

class Aresta
{
    /**
     * @param {number} indiceVerticeInicial Índice do vértice inicial da aresta no
     * arranjo global de vértices.
     * @param {number} indiceVerticeFinal Índice do vértice final da aresta no
     * arranjo global de vértices.
     */
    constructor(
        indiceVerticeInicial, indiceVerticeFinal, peso = ARESTA_PESO_PADRAO,
        cor = ARESTA_COR_PADRAO, corTexto = ARESTA_COR_TEXTO_PADRAO,
        larguraLinha = ARESTA_LARGURA_PADRAO)
    {
        this.indiceVerticeInicial = indiceVerticeInicial;
        this.indiceVerticeFinal = indiceVerticeFinal;
        this.peso = peso;
        this.cor = cor;
        this.corTexto = corTexto;
        this.larguraLinha = larguraLinha;

        this.clonar = this.clonar.bind(this);
        this.existe = this.existe.bind(this);
        this.resetarCorELargura = this.resetarCorELargura.bind(this);
        this.renderizar = this.renderizar.bind(this);
        this.definirPosicoes = this.definirPosicoes.bind(this);

        if (this.existe()) // Checa a existência
        {
            this.definirPosicoes(verticeInicial, verticeFinal);
        }
    }

    /**
     * Checa se a aresta já foi iniciada com seus vértices.
     */
    existe()
    {
        return this.verticeInicial && this.verticeFinal;
    }

    clonar()
    {
        return new Aresta(
            this.indiceVerticeInicial,
            this.indiceVerticeFinal,
            this.peso,
            this.cor,
            this.corTexto,
            this.larguraLinha
        );
    }

    resetarCorELargura()
    {
        this.cor = ARESTA_COR_PADRAO;
        this.larguraLinha = ARESTA_LARGURA_PADRAO;
    }

    /**
     * Define campos internos da aresta com base nos índices do vértices dela
     * no vetor global de vértices.
     * 
     * @param {number} indiceVerticeInicial Índice do vértice inicial da aresta
     * no vetor global de vértices.
     * @param {number} indiceVerticeFinal Índice do vértice final da aresta
     * no vetor global de vértices.
     */
    definirPosicoes(indiceVerticeInicial, indiceVerticeFinal)
    {
        this.indiceVerticeInicial = indiceVerticeInicial;
        this.indiceVerticeFinal = indiceVerticeFinal;
        this.verticeInicial = vertices[indiceVerticeInicial];
        this.verticeFinal = vertices[indiceVerticeFinal];
        this.inicioX = this.verticeInicial.cx;
        this.inicioY = this.verticeInicial.cy;
        this.fimX = this.verticeFinal.cx;
        this.fimY = this.verticeFinal.cy;
        this.centroX = (this.inicioX + this.fimX) / 2;
        this.centroY = (this.inicioY + this.fimY) / 2;

        return this;
    }

    renderizar(context)
    {
        if (this.existe())
        {
            linhaEm(
                context, this.inicioX, this.inicioY,
                this.fimX, this.fimY, this.cor, this.larguraLinha);
                
            textoCentro(
                context, this.peso, this.centroX, this.centroY,
                this.corTexto, null, '13pt Arial');
        }
    }
}

class Caminho
{
    /**
     * @param {number[]} indicesDosVertices Arranjo com os índices dos vértices do
     * caminho.
     * @param {Aresta[][]} grafo Matriz das arestas do grafo onde o caminho está.
     * @param {number} peso Soma dos pesos das arestas do caminho.
     */
    constructor(indicesDosVertices, grafo = null, peso = ARESTA_PESO_PADRAO)
    {
        this.indicesDosVertices = [];
        this.peso = peso;
        this.grafo = grafo;

        this.clonar = this.clonar.bind(this);
        this.numVertices = this.numVertices.bind(this);
        this.existe = this.existe.bind(this);
        this.arestaEntre = this.arestaEntre.bind(this);
        this.adicionar = this.adicionar.bind(this);
        this.recalcularPesos = this.recalcularPesos.bind(this);
        this.permutar2Vertices = this.permutar2Vertices.bind(this);
        this.permutarVerticesApartirDo = this.permutarVerticesApartirDo.bind(this);
        this.permutarVertices = this.permutarVertices.bind(this);
        this.contemVertice = this.contemVertice.bind(this);
        this.obterVertice = this.obterVertice.bind(this);
        this.concatenarCom = this.concatenarCom.bind(this);
        this.podeSerCircuito = this.podeSerCircuito.bind(this);
        this.podeSerCircuitoCompleto = this.podeSerCircuitoCompleto.bind(this);
        this.destacarVertices = this.destacarVertices.bind(this);
        this.mudarArestas = this.mudarArestas.bind(this);
        this.destacarArestas = this.destacarArestas.bind(this);
        this.normalizarArestas = this.normalizarArestas.bind(this);
        this.caminhar = this.caminhar.bind(this);

        if (indicesDosVertices)
        {
            this.peso = 0;
            indicesDosVertices.forEach((indice) => this.adicionar(indice));
        }
    }

    numVertices()
    {
        let tamanho = 0;

        if (this.indicesDosVertices) tamanho = this.indicesDosVertices.length;

        return tamanho;
    }

    /**
     * Checa se o caminho existe, ou seja, se todas as arestas são válidas.
     */
    existe()
    {
        return !!(this.indicesDosVertices && this.numVertices() > 0 && this.peso != Infinity);
    }

    /**
     * Busca a aresta que liga os vértices nos índices informados deste caminho.
     *
     * @param indice0 Índice do primeiro vértice neste caminho.
     * @param indice1 Índice do segundo vértice neste caminho.
     *
     * @returns {Aresta} Aresta entre os vértices.
     */
    arestaEntre(indice0, indice1)
    {
        return this.grafo[this.obterVertice(indice0)][this.obterVertice(indice1)];
    }

    adicionar(indiceDoVertice)
    {
        this.indicesDosVertices.push(indiceDoVertice);
        const tamanho = this.numVertices();

        if (tamanho > 1)
            this.peso += this.arestaEntre(tamanho - 2, tamanho - 1).peso;

        return this;
    }

    recalcularPesos()
    {
        this.peso = 0;
        const tamanho = this.numVertices();

        for (let i = 1; i < tamanho; i++)
        {
            this.peso += this.arestaEntre(i - 1, i).peso;
        }
    }

    /**
     * Acessa as arestas à esquerda e à direita de cada um dos vértices, obtém o
     * peso delas e o acumula multiplicado por um fator no peso total deste caminho.
     *
     * @param vertice0 Índice do primeiro vértice.
     * @param vertice1 Índice do segundo vértice.
     * @param fator Fator de multiplicação do peso das arestas.
     */
    percorrerArestasLigadasA(vertice0, vertice1, fator)
    {
        const vertice0Atual = this.obterVertice(vertice0);
        const verticeEsq0Atual = ( vertice0 > 0 ? this.obterVertice(vertice0 - 1) : null );
        const verticeDir0Atual = ( vertice0 < this.grafo.length - 1 ? this.obterVertice(vertice0 + 1) : null );

        const vertice1Atual = this.obterVertice(vertice1);
        const verticeEsq1Atual = ( vertice1 > 0 ? this.obterVertice(vertice1 - 1) : null );
        const verticeDir1Atual = ( vertice1 < this.grafo.length - 1 ? this.obterVertice(vertice1 + 1) : null );

        const mudarPesoDaAresta = (verticeInicial, verticeFinal, fator) => {
            if (verticeInicial && verticeFinal)
                this.peso += fator * this.arestaEntre(verticeInicial, verticeFinal).peso;
        };

        mudarPesoDaAresta(verticeEsq0Atual, vertice0Atual, fator);
        mudarPesoDaAresta(vertice0Atual, verticeDir0Atual, fator);
        mudarPesoDaAresta(verticeEsq1Atual, vertice1Atual, fator);
        mudarPesoDaAresta(vertice1Atual, verticeDir1Atual, fator);
    }

    /**
     * Permuta os dois vértices nos índices especificados. Isso pode alterar o peso
     * total do caminho por estar alterando as arestas.
     *
     * @param vertice0 Índice do primeiro vértice.
     * @param vertice1 Índice do segundo vértice.
     *
     * @returns {Caminho}
     */
    permutar2Vertices(vertice0, vertice1)
    {
        // this.percorrerArestasLigadasA(vertice0, vertice1, -1);

        [ this.indicesDosVertices[vertice0], this.indicesDosVertices[vertice1] ] =
            [ this.obterVertice(vertice1), this.obterVertice(vertice0) ];

        // this.percorrerArestasLigadasA(vertice0, vertice1, 1);

        return this;
    }

    /**
     * Seja X o vértice no índice recebido, esta função faz todas as permutações
     * possíveis nos vértices posteriores a X e, então, para cada vértice Y posterior
     * a X: permuta X e Y, repete o processo para Y e, então, despermuta X e Y.
     *
     * @param {number} indice Índice de início da permutação na lista de vértices.
     * @param {(Caminho, number) => boolean} funcaoDeManipulacao Receberá como
     * argumentos o próprio caminho atual e o número da permutação (que começa em 0).
     * A função deve retornar um booleano indicando se o processo de permutação deve
     * continuar ou não.
     * @param {number} numPermutacao Número identificador da permutação [0, 1, ...].
     */
    permutarVerticesApartirDo(indice, funcaoDeManipulacao, numPermutacao)
    {
        let retorno = { continuar: true, numPermutacao };

        if (indice == this.grafo.length - 1)
        {
            this.recalcularPesos();
            retorno.continuar = funcaoDeManipulacao(this, numPermutacao);
            if (retorno.continuar) retorno.numPermutacao++;
        }

        else
        {
            // Percorre vértices posteriores ao vértice no índice recebido
            for (let i = indice + 1; retorno.continuar && i < this.grafo.length; i++)
            {
                retorno = this.permutarVerticesApartirDo( // Permuta todos os vértices posteriores
                    indice + 1, funcaoDeManipulacao, retorno.numPermutacao);

                if (retorno.continuar)
                {
                    // Permuta o vértice no índice recebido com um dos seus posteriores
                    this.permutar2Vertices(indice, i);

                    retorno = this.permutarVerticesApartirDo( // Permuta todos os vértices posteriores
                        indice + 1, funcaoDeManipulacao, retorno.numPermutacao);

                    this.permutar2Vertices(indice, i); // Despermuta os vértices
                }
            }
        }

        return retorno;
    }

    /**
     * Gera todas as permutações possíveis dos vértices do caminho e para cada uma
     * delas roda a função recebida como parâmetro passando como argumentos o
     * próprio caminho atual e o número da permutação (que começa em 0). A função
     * deve retornar um booleano indicando se o processo de permutação deve continuar
     * ou não.
     *
     * @param {(Caminho, number) => boolean} funcaoDeManipulacao Receberá como
     * argumentos o próprio caminho atual e o número da permutação (que começa em 0).
     * A função deve retornar um booleano indicando se o processo de permutação deve
     * continuar ou não.
     */
    permutarVertices(funcaoDeManipulacao)
    {
        this.permutarVerticesApartirDo(0, funcaoDeManipulacao, 0);

        return this;
    }

    contemVertice(indiceDoVertice)
    {
        return this.indicesDosVertices.indexOf(indiceDoVertice) >= 0;
    }

    clonar()
    {
        return new Caminho(clonar(this.indicesDosVertices), this.grafo, this.peso);
    }

    obterVertice(indice)
    {
        return this.indicesDosVertices[indice];
    }

    /**
     * Concatena dois caminhos juntando os seus vértices.
     * 
     * @param {Caminho} caminho Caminho que deseja-se concatenar a este.
     * 
     * @return {Caminho} Um novo caminho com os vértices deste caminho e,
     * em seguida, os vértices do caminho recebido incluindo o vértice em
     * comum apenas uma vez.
     */
    concatenarCom(caminho)
    {
        let novoCaminho = this.clonar();

        caminho.indicesDosVertices.forEach(
            (indiceDoVertice, indiceNoArranjo) =>
            {
                if (indiceNoArranjo != 0)
                {
                    novoCaminho.adicionar(indiceDoVertice);
                }
            }
        );
        
        return novoCaminho;
    }

    destacarVertices()
    {
        this.indicesDosVertices.forEach((index) => vertices[index].destacar());
    }

    podeSerCircuito()
    {
        const tamanho = this.numVertices();

        return this.existe() && this.arestaEntre(tamanho - 1, 0).existe();
    }

    podeSerCircuitoCompleto()
    {
        return this.podeSerCircuito() && this.numVertices() == this.grafo.length;
    }

    mudarArestas(cor, larguraLinha)
    {
        if (this.numVertices() > 0)
        {
            let i = 0;
            // Pega o índice do primeiro vértice do caminho
            let indiceAtual = this.obterVertice(i);
            let proximoIndice, menor, maior;

            for (i = 1; i < this.numVertices(); i++)
            {
                // Pega o índice do próximo vértice que se liga ao anterior
                proximoIndice = this.obterVertice(i);
                // Descobre o maior e o menor índice. Como o grafo é não direcionado,
                // só renderizo as arestas abaixo da diagonal principal na matriz de
                // adjacências, daí preciso acessar o maior índice como linha para
                // garantir que estarei mudando uma aresta abaixo da diagonal principal.
                menor = Math.min(indiceAtual, proximoIndice);
                maior = Math.max(indiceAtual, proximoIndice);
                arestas[maior][menor].cor = cor;
                arestas[maior][menor].larguraLinha = larguraLinha;
                indiceAtual = proximoIndice;
            }
        }
    }

    destacarArestas(
        corAresta = ARESTA_COR_ATIVADA, larguraAresta = ARESTA_LARGURA_ATIVADA)
    {
        this.mudarArestas(corAresta, larguraAresta);
        return this;
    }

    normalizarArestas() { this.mudarArestas(ARESTA_COR_PADRAO, ARESTA_LARGURA_PADRAO); }

    caminhar()
    {
        let promessa = new Promise((resolve, reject) => resolve());

        if (this.numVertices() > 0)
        {
            let i = 0;
            // Pega o índice do primeiro vértice do caminho
            let indiceAtual = this.obterVertice(i);
            let proximoIndice;
            
            promessa = new Promise(
                (resolve, reject) =>
                {
                    forComPromise(1, this.numVertices(),
                        (valorAtual, resolveFor) =>
                        {
                            // debugger;
                            // Pega o índice do próximo vértice que se liga ao anterior
                            proximoIndice = this.obterVertice(valorAtual);
        
                            setas[0].moverPara(
                                vertices[proximoIndice].cx, vertices[proximoIndice].cy, 1000,
                                vertices[indiceAtual].cx, vertices[indiceAtual].cy
                            ).then(
                                () =>
                                {
                                    indiceAtual = proximoIndice;
                                    resolveFor();
                                }
                            );
                        }
                    ).then(() => resolve(this));
                }
            );
        }

        return promessa;
    }
}

/**
 * Desrenderiza todas as arestas do grafo.
 * 
 * @param {Aresta[]} grafo Matriz de arestas do grafo.
 */
function desrenderizarArestas(grafo)
{
    percorrerMetadeDaMatriz(grafo,
        (linha, coluna, aresta) => aresta.resetarCorELargura());
}

/**
 * Desrenderiza todas as arestas dos grafos.
 */
function desrenderizarTodasArestas()
{
    desrenderizarArestas(grafoDistancias);
    desrenderizarArestas(grafoPrecos);
}

/**
 * Cria uma matriz de arestas vazias para um grafo.
 * 
 * @param {number} numeroDeVertices Número de vértices do grafo.
 * @param {number} pesoPadrao Peso padrão para as arestas.
 * @param {number} pesoDiagonalPrincipal Peso padrão da diagonal principal.
 * 
 * @return {Aresta[][]} Uma matriz de arestas.
 */
function iniciarArestas(
    numeroDeVertices, pesoPadrao = ARESTA_PESO_PADRAO, pesoDiagonalPrincipal = 0)
{
    const matriz = new Array(numeroDeVertices);

    for (let i = 0; i < numeroDeVertices; i++)
    {
        matriz[i] = new Array(numeroDeVertices)
            .fill(null).map(
                (valor, indice) => new Aresta(i, indice, pesoPadrao).definirPosicoes(i, indice));

        matriz[i][i].peso = pesoDiagonalPrincipal;
    }

    return matriz;
}

/**
 * Percorre as posições da matriz do grafo informado.
 * 
 * @param {Aresta[][]} grafo Matriz do grafo.
 * @param {(linha: number, coluna: number, valor: Aresta) => any} gerenciarCelula
 * Função que receberá a linha, a coluna e o valor da célula para poder manusear.
 */
function percorrerMatriz(grafo, gerenciarCelula)
{
    let linha;

    for (let i = 0; i < grafo.length; i++)
    {
        linha = grafo[i];
        
        for (let j = 0; j < linha.length; j++)
        {
            gerenciarCelula(i, j, linha[j]);
        }
    }
}

/**
 * Percorre metade da matriz do grafo informado. Ignora toda a parte a cima da
 * diagonal principal da matriz.
 * 
 * @param {Aresta[][]} grafo Matriz do grafo.
 * @param {(linha: number, coluna: number, valor: Aresta) => any} gerenciarCelula
 * Função que receberá a linha, a coluna e o valor da célula para poder manusear.
 */
function percorrerMetadeDaMatriz(grafo, gerenciarCelula)
{
    let linha;

    for (let i = 0; i < grafo.length; i++)
    {
        linha = grafo[i];
        
        for (let j = 0; j <= i; j++)
        {
            gerenciarCelula(i, j, linha[j]);
        }
    }
}
