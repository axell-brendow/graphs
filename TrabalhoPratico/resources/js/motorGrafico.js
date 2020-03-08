/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Arquivo destinado à renderização dos elementos na página.
 */

class Seta
{
    /**
     * @param {boolean} visivel Indica se a seta deve estar visível ou não.
     * @param {number} x Abscissa da seta no canvas.
     * @param {number} y Ordenada da seta no canvas.
     * @param {number} angulo Ângulo, em radianos, que a seta deve apontar.
     */
    constructor(visivel, x, y, angulo)
    {
        this.visivel = visivel;
        this.x = x;
        this.y = y;
        this.angulo = angulo;

        this.moverPara = this.moverPara.bind(this);
        this.renderizar = this.renderizar.bind(this);
    }

    /**
     * Renderiza e anima uma seta que começa no ponto (x0, y0) e navega até (x1, y1)
     * no tempo especificado em milisegundos.
     *
     * @param {number} x1 Abscissa inicial da seta.
     * @param {number} y1 Ordenada inicial da seta.
     * @param {number} tempo Tempo, em milisegundos, que a seta deve demorar para
     * fazer o percurso.
     * @param {number} x0 Abscissa inicial da seta. Caso não informada, será usada
     * a atual.
     * @param {number} y0 Ordenada inicial da seta. Caso não informada, será usada
     * a atual.
     */
    moverPara(x1, y1, tempo = 1000, x0 = null, y0 = null)
    {
        if (!x0) x0 = this.x;
        if (!y0) y0 = this.y;

        let deltaX = x1 - x0;
        let deltaY = y1 - y0;
        let velocidadeX = deltaX / tempo;
        let velocidadeY = deltaY / tempo;
        // Nego deltaY pois o eixo Y é para baixo, ou seja, y = -10 no sistema
        // tradicional é equivalente a y = 10 no canvas do HTML.
        let angulo = Math.atan2(-deltaY, deltaX);
    
        this.visivel = true;
        this.x = x0;
        this.y = y0;
        this.angulo = converterAnguloParaOCanvas(angulo);
    
        for (let i = 0; i < tempo; i++)
        {
            setTimeout( // De 1 em 1 milisegundo renderiza a seta movimentando.
                () =>
                {
                    this.x += velocidadeX;
                    this.y += velocidadeY;
                },
                i + 1
            );
        }
    
        return new Promise(
            (resolve, reject) =>
            {
                setTimeout(
                    () =>
                    {
                        this.visivel = false;
                        resolve();
                    },
                    tempo + 2
                );
            }
        );
    }

    renderizar()
    {
        if (this.visivel) desenharCabecaDeSeta(context, this.x, this.y, this.angulo);
    }
}

let setas = [new Seta(false, 0, 0, 0)];

const hexa = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

/**
 * Gera uma cor aleatória no formato hexadecimal. Ex.: #73A94F
 * 
 * @return {string} Cor aleatória no formato hexadecimal.
 */
function gerarCorAleatoria()
{
    let cor = "#";
    let numeroAleatorio;

    for (let i = 0; i < 6; i++)
    {
        numeroAleatorio = Math.floor(Math.random() * 16);
        cor += hexa[numeroAleatorio];
    }

    return cor;
}

/**
 * Lê a largura e a altura do mapa e redefine as variáveis globais largura e altura.
 */
function atualizarMedidasImagem()
{
    largura = parseInt(imgStyle.getPropertyValue('width'));
    altura = parseInt(imgStyle.getPropertyValue('height'));
}

/**
 * Renderiza todas as arestas do grafo ignorando arestas paralelas ou arestas
 * não inicializadas.
 * 
 * @param {Aresta[][]} grafo Matriz de arestas do grafo.
 */
function renderizarArestas(grafo)
{
    percorrerMetadeDaMatriz(grafo,
        (linha, coluna, aresta) =>
        {
            if (aresta.existe() && aresta.peso !== ARESTA_PESO_PADRAO) aresta.renderizar(context);
        }
    );
}

/**
 * Renderiza as arestas, os vértices e as setas de voo nessa ordem.
 */
function draw()
{
    atualizarMedidasImagem();
    context.clearRect(0, 0, largura, altura);

    renderizarArestas(arestas);
    vertices.forEach((vertice) => vertice.renderizar(context));

    setas.forEach((seta) => seta.renderizar());
}

function loop(timestamp)
{
    let progress = (timestamp - lastRender);

    // update(progress)
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

function iniciarGrafico()
{
    // requestAnimationFrame() passa o timestamp para loop
    window.requestAnimationFrame(loop);
}
