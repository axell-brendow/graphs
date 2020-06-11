# Sistema de passagens aéreas - Grafos

Este projeto traz um [site/sistema](https://axell-brendow.github.io/graphs/) que simula problemas de passagens aéreas e trafego de aviões num mapa.

É resultado de um trabalho prático da disciplina Grafos do curso de Ciência da Computação da PUC Minas.

### Como utilizar ?

Basta abrir o arquivo index.html, carregar a localização dos aeroportos de um arquivo e os preços das passagens de outro. Já existem dois arquivos de exemplo nesta pasta para testar o sistema: 1-localizacao_aeroportos.txt e 2-pyprecos_passagens.txt.

### Entendendo o código

Recomendo começar pelos arquivos **index.html**, **global.js** **index.js**, **motorGrafico.js** e **UI.js**. Todos os outros códigos são chamados por eventos que estão em alguns desses arquivos.

- **index.html** - Onde você poderá encontrar as tags &lt;script&gt; com os links para todos os arquivos .js utilizados no projeto.

- **global.js** - Declara variáveis globais e algumas funções importantes.

- **index.js** - carrega variáveis globais com elementos HTML e define alguns eventos sobre arquivos. Por exemplo, quando você carregar os arquivos com os aeroportos e os preços, os eventos desse arquivo serão acionados.

- **motorGrafico.js** - cuida da renderização dos elementos.

- **UI.js** - cuida de todos os eventos relacionados à interface e interação com o usuário. Por exemplo, quando você clicar nos menus, os eventos desse arquivo serão acionados.

### Descrição dos problemas

- > Encontrar o **menor caminho** entre dois aeroportos. Em alguns casos, como não há ligação direta entre os aeroportos, é necessário passar por aeroportos intermediários para conseguir chegar no destino final.

- > Encontrar a **menor tarifa** entre dois aeroportos. Em alguns casos, como não há ligação direta entre os aeroportos, é necessário passar por aeroportos intermediários para conseguir chegar no destino final e, além disso, pode ser que a ligação direta entre os dois aeroportos seja mais cara do que uma rota que posse por outros.

- > Encontrar a **menor tarifa** para uma viagem ao redor do mundo passando por cada aeroportos uma vez. Esse problema exige encontrar a melhor sequência de rotas que passe por todos os aeroportos do mundo com o mínimo de custo possível.

- > Encontrar o subconjunto de trechos que permita ir de **qualquer origem** para **qualquer destino** com o **menor valor total**.

- > Considerando que duas rotas que se cruzam não podem voar na mesma altitude, propor uma altura de voo para cada rota. Começar a 10.000 pés e aumentar de mil em mil. Para economizar combustível, o somatório das altitudes deve ser a mínima possível.

### Modelagem utilizada

- Os aeroportos são transformados em vértices do grafo no mapa. Os vértices são representados por círculos.

- Os segmentos que unem os vértices são as arestas do grafo e o valor no meio deles representa o peso delas. Ao rodar um algoritmo que analisa distâncias, as arestas teram pesos proporcionais às distâncias. Caso o algoritmo analise tarifas, as arestas teram pesos proporcionais às tarifas.

- Existem três classes no arquivo **grafos.js** (Vertice, Aresta e Caminho) que são a representação desses elementos em código. Um caminho é apenas uma sequência alternada de vértices e arestas.

### Técnicas utilizadas

Para a solução dos problemas propostos usou-se das seguintes técnicas:

- Algoritmo de Dijkstra (Obtém o caminho de menor custo entre dois vértices de um grafo).
- Algoritmo de Floyd Warshall (Obtém os caminhos de menor custo entre todos os vértices de um grafo).
- Algoritmos combinatórios de força bruta e algumas heurísticas para problemas envolvendo caminhos Hamiltonianos.
- Algoritmos da Geometria Analítica para interseção de retas.

### Bibliografia

- Material didático da disciplina
- [Stack Overflow](https://stackoverflow.com/)
