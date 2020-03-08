/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/**
 * Arquivo com funções de geometria no geral e renderização de elementos geométricos.
 */

let FONTE_PADRAO = '10pt Arial';

/**
 * Converte um ângulo em radianos para o equivalente no Canvas JavaScript.
 * 
 * @param {number} angulo Ângulo em radianos onde o 0 graus fica no eixo x
 * e a rotação é anti-horária.
 */
function converterAnguloParaOCanvas(angulo)
{
    return Math.PI / 2 - angulo;
}

/**
 * Calcula a distância entre dois pontos.
 * 
 * @param {number} x0 Abscissa inicial.
 * @param {number} y0 Ordenada inicial.
 * @param {number} x1 Abscissa final.
 * @param {number} y1 Ordenada final.
 */
function distanciaEntre(x0, y0, x1, y1)
{
    let deltaX = x1 - x0;
    let deltaY = y1 - y0;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Desenha um texto no contexto informado.
 * 
 * @param {RenderingContext} context Contexto do desenho.
 * @param {string} text Texto a ser desenhado.
 * @param {number} lowerLeftX Abscissa do canto inferior esquerdo do texto.
 * @param {number} lowerLeftY Ordenada do canto inferior esquerdo do texto.
 * @param {string} color Cor do texto.
 * @param {string} borderColor Cor da borda do texto.
 * @param {string} font Fonte do texto.
 */
function texto(
    context, text, lowerLeftX, lowerLeftY, color = 'black',
    borderColor = null, font = FONTE_PADRAO)
{
    context.beginPath();
    context.font = font;
    context.fillStyle = color;
    context.fillText(text, lowerLeftX, lowerLeftY);

    if (borderColor)
    {
        context.strokeStyle = borderColor;
        context.strokeText(text, lowerLeftX, lowerLeftY);
        context.stroke();
    }
}

/**
 * Desenha um texto no contexto informado.
 * 
 * @param {RenderingContext} context Contexto do desenho.
 * @param {string} text Texto a ser desenhado.
 * @param {number} cx Abscissa do centro do texto.
 * @param {number} cy Ordenada do centro do texto.
 * @param {string} color Cor do texto.
 * @param {string} borderColor Cor da borda do texto.
 * @param {string} font Fonte do texto.
 */
function textoCentro(context, text, cx, cy, color = 'black',
    borderColor = null, font = FONTE_PADRAO)
{
    let largura = context.measureText(text);
    
    texto(context, text, cx - largura.width / 2, cy + 5, color, borderColor, font);
}

/**
 * Desenha um círculo no contexto informado.
 * 
 * @param {RenderingContext} context Contexto do desenho.
 * @param {number} cx Abscissa do centro do círculo.
 * @param {number} cy Ordenada do centro do círculo.
 * @param {number} r Raio do círculo.
 * @param {string} color Cor do círculo.
 * @param {string} borderColor Cor da borda do círculo.
 * @param {number} borderLineWidth Tamanho da borda do texto.
 */
function circulo(
    context, cx, cy, r, color, borderColor = null, borderLineWidth = null)
{
    context.beginPath();
    context.arc(cx, cy, r, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();

    if (borderColor)
    {
        if (borderLineWidth)
        {
            context.save();
            context.lineWidth = borderLineWidth;
            context.strokeStyle = borderColor;
            context.stroke();
            context.restore();
        }

        else
        {
            context.strokeStyle = borderColor;
            context.stroke();
        }
    }
}

/**
 * Desenha uma linha no contexto informado.
 * 
 * @param {RenderingContext} context Contexto do desenho.
 * @param {number} x0 Abscissa inicial da linha.
 * @param {number} y0 Ordenada inicial da linha.
 * @param {number} x1 Abscissa final da linha.
 * @param {number} y1 Ordenada final da linha.
 * @param {string} color Cor da linha.
 * @param {number} lineWidth Larguda da linha.
 */
function linhaEm(context, x0, y0, x1, y1, color = "black", lineWidth = null)
{
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;

    if (lineWidth)
    {
        context.save();
        context.lineWidth = lineWidth;
        context.stroke();
        context.restore();
    }

    else context.stroke();
}

/**
 * Desenha a cabeça de uma seta (►) no contexto informado.
 * 
 * @param {RenderingContext} context Contexto do desenho.
 * @param {number} x Abscissa da ponta da seta.
 * @param {number} y Ordenada da ponta da seta.
 * @param {number} radians Ângulo em radianos para o qual a ponta da seta deve apontar.
 * @param {string} color Cor da seta.
 */
function desenharCabecaDeSeta(context, x, y, radians, color = "#3388ff")
{
    context.save();
    context.beginPath();
    context.translate(x,y);
    context.rotate(radians); // O ângulo 0 é o eixo y e a rotação é horária.
    context.moveTo(0,0);
    context.lineTo(5,20); // Cria uma lateral da seta.
    context.lineTo(-5,20); // Cria o lado menor.
    context.closePath(); // Fecha o caminho (criando a outra lateral).
    context.restore();
    context.fillStyle = color;
    context.fill();
}

/**
 * Checa se o ponto P(x0, y0) está dentro da circunferência λ (lambda)
 * (cx, cy, r).
 * 
 * @param {number} cx Abscissa do centro da circunferência.
 * @param {number} cy Ordenada do centro da circunferência.
 * @param {number} r Raio da circunferência.
 * @param {number} x0 Abscissa do ponto.
 * @param {number} y0 Ordenada do ponto.
 */
function estaDentroDoCirculo(cx, cy, r, x0, y0)
{
    // Se ele estiver dentro, a distância entre os dois pontos deve ser menor
    // ou igual ao raio. Considerando o centro de λ (lambda) como o centro também da
    // circunferência γ (gamma) (cx, cy, distância(x0, y0, cx, cy)), a área de γ deve
    // ser menor ou igual à de λ. x0 - cx e y0 - cy dão os catetos do triângulo
    // retângulo cuja hipotenusa é igual a distância(x0, y0, cx, cy). A distância
    // ao quadrado será igual à soma dos quadrados dos catetos. Sabendo o quadrado da
    // distância (raio de γ), é possível saber sua área.

    let catetoHorizontal = x0 - cx;
    let catetoVertical = y0 - cy;
    let distanciaAoQuadrado =
        catetoHorizontal * catetoHorizontal +
        catetoVertical * catetoVertical;

    return distanciaAoQuadrado <= r * r;
}
