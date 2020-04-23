/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Arquivo com funções para leitura dos dados dos aeroportos e preços de passagem.
 */

/**
 * Lê o arquivo passado ignorando as linhas que contém os caracteres //.
 * 
 * @param {File} arquivo Arquivo com os dados a serem processados.
 * @param {(colunas: string[], indiceLinha: number) => void} funcaoParaManipular Função
 * para manipular as colunas das linhas do arquivo. O primeiro parâmetro que será
 * passado para essa função são as colunas da linha que são delimitadas por espaços.
 * O segundo parâmetro é o índice da linha no arquivo imaginando que o arquivo não
 * tivesse a primeira linha.
 * 
 * @return {Promise<number>} Uma promessa que devolverá a quantidade de
 * entradas do arquivo (comentadas ou não). O arquivo deve trazer essa informação
 * em sua primeira linha.
 */
function carregarArquivo(arquivo, funcaoParaManipular)
{
    let leitor = new FileReader();
    let numeroDeEntradas = 0;

    return new Promise(
        (resolve, reject) =>
        {
            leitor.onload = (event) => // É disparado quando o métodos de read é chamado
            {
                let texto = event.target.result; // conteúdo do arquivo
                let linhas = texto.split("\n");
                numeroDeEntradas = parseInt(linhas[0]);
                let colunas;
        
                for (let i = 0; i < numeroDeEntradas; i++)
                {
                    colunas = linhas[i + 1].split(" ");

                    if (!colunas[0].includes("//")) funcaoParaManipular(colunas, i);
                }

                resolve(numeroDeEntradas);
            };
        
            leitor.readAsText(arquivo); // Ativa o evento .onload
        }
    );
}

/**
 * Cria o grafo das distâncias entre os aeroportos.
 * 
 * @param {Vertice[]} vertices Lista dos vértices com os aeroportos.
 */
function carregarGrafoDasDistancias(vertices)
{
    let inicio, fim, deltaX, deltaY, outraAresta;

    grafoDistancias = iniciarArestas(numeroDeVertices);

    percorrerMetadeDaMatriz(grafoDistancias,
        (linha, coluna, aresta) =>
        {
            if (grafoPrecos[linha][coluna].existe())
            {
                outraAresta = grafoDistancias[coluna][linha];
                inicio = vertices[linha];
                fim = vertices[coluna];
                deltaX = fim.cx - inicio.cx;
                deltaY = fim.cy - inicio.cy;
    
                aresta.definirPosicoes(linha, coluna);
                outraAresta.definirPosicoes(coluna, linha);
                aresta.peso = outraAresta.peso = Math.abs(deltaX) + Math.abs(deltaY);
                // aresta.peso = distanciaEntre(0, 0, deltaX, deltaY);
            }
        }
    );
}

/**
 * Transforma a longitude do ponto numa coordenada cartesiana no eixo X.
 * Esta função assume que o plano cartesiano começa em (0, 0) e não tem
 * coordenadas negativas.
 * 
 * @param {number} longitude Coordenada esférica horizontal do ponto na terra.
 * @param {number} larguraMaxima Largura máxima do plano cartesiano. 
 */
function obterAbscissa(longitude, larguraMaxima)
{
    // A longitude do mapa vai de -163 a 173. Os cálculos abaixo representam a
    // equação de uma reta que transforma longitude em abscissa no mapa.
    // abscissa = f(logitude), pontos dados da reta:
    // f(-163) = 0
    // f(+173) = larguraMaxima
    // let abscissa = (larguraMaxima * longitude + 163 * larguraMaxima) / (163 + 173);

    // A longitude do mapa vai de -163 a 173. Os cálculos abaixo representam a
    // equação de uma reta que transforma longitude em abscissa no mapa.
    // abscissa = f(logitude), pontos dados da reta:
    // f(-46.0) = 33.5% * larguraMaxima
    // f(68.38) = 66.0% * larguraMaxima
    let abscissa = 0.00284141 * larguraMaxima * longitude + 0.465705 * larguraMaxima;

    return abscissa;
}

/**
 * Transforma a latitude do ponto numa coordenada cartesiana no eixo Y.
 * Esta função assume que o plano cartesiano começa em (0, 0) e não tem
 * coordenadas negativas e que o eixo Y do plano cartesiano é para baixo.
 * 
 * @param {number} latitude Coordenada esférica vertical do ponto na terra.
 * @param {number} alturaMaxima altura máxima do plano cartesiano. 
 */
function obterOrdenada(latitude, alturaMaxima)
{
    // A latitude do mapa vai de -52 a 72. Os cálculos abaixo representam a
    // equação de uma reta que transforma latitude em ordenada no mapa.
    // ordenada = f(latitude), pontos dados da reta:
    // f(-52) = alturaMaxima
    // f(+72) = 0
    // let ordenada = -alturaMaxima * latitude / 124 + 18 * alturaMaxima / 31;

    // A latitude do mapa vai de -52 a 72. Os cálculos abaixo representam a
    // equação de uma reta que transforma latitude em ordenada no mapa.
    // ordenada = f(latitude), pontos dados da reta:
    // f(+43.7) = 34% * alturaMaxima
    // f(-5.44) = 66.4% * alturaMaxima
    let ordenada = -0.00659341 * alturaMaxima * latitude + 0.628132 * alturaMaxima;
    
    return ordenada;
}

/**
 * Lê as posições dos aeroportos e cria os vértices para eles.
 * 
 * @param {File} arquivo Arquivo onde a primeira linha informa a quantidade de
 * aeroportos que viram nas próximas linhas. As próximas linhas devem ter o
 * seguinte formato: SIGLA LATITUDE LONGITUDE
 */
function carregarAeroportos(arquivo)
{
    let sigla, latitude, longitude;
    dictSiglas = {};
    vertices = [];

    carregarArquivo(arquivo,
        (colunas, indiceLinha) =>
        {
            sigla = colunas[0];
            latitude = parseFloat(colunas[1]);
            longitude = parseFloat(colunas[2]);
            dictSiglas[sigla] = indiceLinha;
            
            vertices.push(
                new Vertice(
                    sigla,
                    obterAbscissa(longitude, largura),
                    obterOrdenada(latitude, altura),
                )
            );
        }
    ).then(
        (numeroDeEntradas) =>
        {
            numeroDeVertices = numeroDeEntradas;
            
            if (inputPrecos.files.length > 0) carregarPrecos(inputPrecos.files[0]);
        }
    );
}

/**
 * Lê as os preços de passagem entre aeroportos e cria as arestas para eles.
 * 
 * @param {File} arquivo Arquivo onde a primeira linha informa a quantidade de
 * preços que viram nas próximas linhas. As próximas linhas devem ter o seguinte
 * formato: SIGLA_ORIGEM SIGLA_DESTINO PREÇO
 */
function carregarPrecos(arquivo)
{
    if (numeroDeVertices <= 0)
    {
        alert('Carregue o arquivo com os aeroportos primeiro.');
    }

    else
    {
        let siglaOrigem, siglaDestino, arestaOrigemDestino, arestaDestinoOrigem,
            preco, indiceOrigem, indiceDestino;
    
        grafoPrecos = iniciarArestas(numeroDeVertices);
        
        carregarArquivo(arquivo,
            (colunas, indiceLinha) =>
            {
                [siglaOrigem, siglaDestino, preco] = colunas; // Destructuring syntax
                
                // Obtém os índices dos vértices correspondentes às siglas
				indiceOrigem = dictSiglas[siglaOrigem];
                indiceDestino = dictSiglas[siglaDestino];

                arestaOrigemDestino = grafoPrecos[indiceOrigem][indiceDestino];
                arestaDestinoOrigem = grafoPrecos[indiceDestino][indiceOrigem];

                arestaOrigemDestino.peso = arestaDestinoOrigem.peso = parseInt(preco);
                arestaOrigemDestino.definirPosicoes(indiceOrigem, indiceDestino);
                arestaDestinoOrigem.definirPosicoes(indiceDestino, indiceOrigem);
            }
        ).then(
            (numeroDeEntradas) =>
            {
                carregarGrafoDasDistancias(vertices);
                arestas = grafoDistancias;
            }
        );
    }
}
