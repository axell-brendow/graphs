function mostrar(grafo)
{ console.log(JSON.stringify(grafo).replace(/\]\,/g, "],\n")); }

function objetosSaoIguais(matriz1, matriz2)
{ return JSON.stringify(matriz1) == JSON.stringify(matriz2); }

function permutarColunas(grafo, coluna1, coluna2)
{
for (let i = 0; i < grafo.length; i++)
    // Troca os valores das duas colunas um a um verticalmente
    [ grafo[i][coluna1], grafo[i][coluna2] ] = [ grafo[i][coluna2], grafo[i][coluna1] ];
}

function saoIsomorfosR(grafo1, grafo2, start)
{
    let iguais = false;
    if (start == grafo2.length)
    {
        mostrar(grafo2); console.log();
        iguais = objetosSaoIguais(grafo1, grafo2);
    }
    else // 
        for (let i = start; !iguais && i < grafo2.length; i++)
        {
            [ grafo2[i], grafo2[start] ] = [ grafo2[start], grafo2[i] ]; // Permuta linhas
            permutarColunas(grafo2, i, start); // Permuta colunas

            // Permuta os vértices a partir do índice start + 1
            iguais = saoIsomorfosR(grafo1, grafo2, start + 1);

            permutarColunas(grafo2, i, start); // Desfaz a permutação das colunas
            [ grafo2[i], grafo2[start] ] = [ grafo2[start], grafo2[i] ];// Desfaz as linhas
        }
    return iguais;
}

function saoIsomorfos(grafo1, grafo2)
{
    console.log('Grafo original:\n'); mostrar(grafo1);
    console.log('\nGrafo a comparar:\n'); mostrar(grafo2);
    console.log('\nIniciando a permutação do grafo acima...\n');
    return saoIsomorfosR(grafo1, grafo2, 0);
}

let grafo1 = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
];

let grafo2 = [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
];

console.log(
    saoIsomorfos(grafo1, grafo2) ? "Grafos isomorfos." : "Grafos não isomorfos.");
