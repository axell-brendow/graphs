#include <iostream>
#include <vector>
#include <functional>
#include <string>

using namespace std;

const string COLOR_NAMES[3] = { "WHITE", "GRAY", "BLACK" };

class Vertex
{
    public:
        // ----------------- Constants

        enum Color { WHITE, GRAY, BLACK };

        // ----------------- Attributes

        /**
         * Vertex index in the adjacency matrix.
         */
        int index;

        /**
         * Vertex color for algorithms.
         */
        int color;

        // ----------------- Constructors

        Vertex(int index, int color) : index(index), color(color) {}

        Vertex(int index) : Vertex(index, WHITE) {}

        Vertex() : Vertex(-1) {}

        // ----------------- Methods

        void resetColor() { color = WHITE; }
};

ostream& operator<<(ostream& ostream, Vertex& vertex)
{
    return ostream << "Vertex(" << vertex.index << ", "
        << COLOR_NAMES[vertex.color] << ")";
}

template<typename WEIGHT_TYPE = int>
class Edge
{
    public:
        // ----------------- Attributes

        WEIGHT_TYPE weight;
        Vertex vertex0;
        Vertex vertex1;
        bool isValid;

        // ----------------- Constructors

        Edge(WEIGHT_TYPE weight, Vertex vertex0, Vertex vertex1, bool isValid) :
            weight(weight), vertex0(vertex0), vertex1(vertex1), isValid(isValid) {}

        Edge(WEIGHT_TYPE weight, Vertex vertex0, Vertex vertex1) :
            Edge(weight, vertex0, vertex1, false) {}

        Edge() : Edge(WEIGHT_TYPE(), Vertex(), Vertex()) {}
};

template<typename WEIGHT_TYPE = int>
ostream& operator<<(ostream& ostream, Edge<WEIGHT_TYPE>& edge)
{
    return ostream << "(" << edge.vertex0 << ", " << edge.vertex1 << ")";
}

template<typename WEIGHT_TYPE = int>
class Graph
{
    public:
        // ----------------- Typedefs

        /**
         * Standardizes the edge type.
         */
        typedef Edge<WEIGHT_TYPE> EDGE_TYPE;

        /**
         * Standardizes the edges vector type.
         */
        typedef vector<EDGE_TYPE> EDGES_VEC;

        // ----------------- Attributes

        /**
         * Graph's adjacency matrix.
         */
        vector<EDGES_VEC> matrix;
        vector<Vertex> vertices;

        int numberOfVertices;

        // ----------------- Constructors and destructors

        Graph(int numberOfVertices)
        {
            this->numberOfVertices = ( numberOfVertices >= 0 ? numberOfVertices : 0 );

            // Creates vertices
            vertices.resize(numberOfVertices);
            
            for (size_t i = 0; i < numberOfVertices; i++)
            {
                vertices[i] = Vertex(i);
            }
            
            // Creates adjacency matrix
            matrix.resize(numberOfVertices);

            for (size_t i = 0; i < numberOfVertices; i++)
            {
                matrix[i].resize(numberOfVertices);

                for (size_t j = 0; j < numberOfVertices; j++)
                {
                    matrix[i][j] = Edge<WEIGHT_TYPE>(WEIGHT_TYPE(), vertices[i], vertices[j]);
                }
            }
        }
        
        // ----------------- Methods

        /**
         * Run through all vector pairs and set the edge at
         * matrix[pair.first][pair.second] to be valid.
         * 
         * @param pairsOfVertices Vector of pairs with the indexes of the
         * vertices of the edge.
         */
        void readEdges(vector< pair<int, int> >& pairsOfVertices)
        {
            for (auto &&pair : pairsOfVertices)
            {
                matrix[pair.first][pair.second].isValid = true;
            }
        }

        /**
         * Resets all vertex colors.
         */
        void resetColors()
        {
            for (auto &&vertice : vertices)
            {
                vertice.resetColor();
            }
        }

        EDGES_VEC& getEdgesOf(Vertex& vertex)
        {
            return matrix[vertex.index];
        }

        void depthFirstSearch(Vertex& vertex)
        {
            EDGES_VEC& edges = getEdgesOf(vertex);
            vertex.color = Vertex::Color::GRAY;

            cout << (char)(vertex.index + 'a') << ",";

            for (auto &&edge : edges)
            {
                if (edge.isValid)
                {
                    Vertex& oppositeVertex = edge.vertex1;

                    if (oppositeVertex.color == Vertex::Color::WHITE)
                        depthFirstSearch(oppositeVertex);
                }
            }
            
            vertex.color = Vertex::Color::BLACK;
        }

        /**
         * Traverses all vertices with the depth-first search algorithm.
         * 
         * @return The number of components of the graph.
         */
        int depthFirstSearch()
        {
            resetColors();
            int numberOfComponents = 0;

            for (auto &&vertex : vertices)
            {
                if (vertex.color == Vertex::Color::WHITE)
                {
                    vertex.color = Vertex::Color::GRAY;
                    numberOfComponents++;
                    depthFirstSearch(vertex);
                    cout << endl;
                }
            }
            
            return numberOfComponents;
        }
};

int main()
{
    int numberOfCases = 0, numberOfVertices = 0, numberOfEdges = 0;
    string vertex0 = "", vertex1 = "";
    cin >> numberOfCases;
    
    for (size_t i = 0; i < numberOfCases; i++)
    {
        cout << "Case #" << (i + 1) << ":" << endl;
        cin >> numberOfVertices >> numberOfEdges;

        Graph<> graph(numberOfVertices);
        vector< pair<int, int> > pairsOfVertices(numberOfEdges);

        for (size_t j = 0; j < numberOfEdges; j++)
        {
            cin >> vertex0 >> vertex1;
            pairsOfVertices[j] = pair<int, int>(vertex0[0] - 'a', vertex1[0] - 'a');
        }

        graph.readEdges(pairsOfVertices);
        cout << graph.depthFirstSearch() << " connected components" << endl << endl;
    }
    
    return 0;
}
