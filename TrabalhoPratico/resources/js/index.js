/**
 * Repositório do projeto:
 * https://github.com/axell-brendow/ComputerScience/tree/master/Grafos/TrabalhoPratico
 */

/* Transição do menu responsivo
#navbar li
{
    float: none;
}

#navbar
{
    float: none;
    display: block;
    position: absolute;
    // right: 1ch; // menu à direita
    // bottom: 100%;
    // left: 1ch; // menu à esquerda
    // bottom: 0;
    border: none;
    background-color: #f8f8f8;
    border: 1px solid #dddddd;
}
*/

window.onload = function () {
    body = document.getElementsByTagName("body");
    inputAeroportos = document.getElementById("input-aeroportos");
    inputPrecos = document.getElementById("input-precos");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    img = document.getElementById("mapa");

    let botaoResponsivo = document.getElementsByClassName("navbar-toggle")[0];
    botaoResponsivo.addEventListener("click", event => {
        // O botão responsivo alterna o menu em resoluções baixas,
        // 'data-target' tem o id do menu alvo do botão
        let target = botaoResponsivo.attributes["data-target"].value.replace(
            "#",
            ""
        );

        let style = document.getElementById(target).style; // Obtém o estilo do menu

        style.display = style.display == "block" ? "none" : "block"; // Alterna
    });

    imgStyle = window.getComputedStyle(img);
    atualizarMedidasImagem();

    context.canvas.width = largura;
    context.canvas.height = altura;

    vertices = criarVerticesAleatorios(largura, altura);
    arestas = grafoDistancias = criarArestasAleatorias(vertices.length);
    grafoPrecos = criarArestasAleatorias(vertices.length);
    iniciarGrafico();

    inputAeroportos.addEventListener("change", event => {
        if (event.target.files[0]) carregarAeroportos(event.target.files[0]);
    });

    inputPrecos.addEventListener("change", event => {
        if (event.target.files[0]) carregarPrecos(event.target.files[0]);
    });
};
