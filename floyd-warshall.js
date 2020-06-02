//----------------------------------Customization Area--------------------------------//

/**
 * The relative or absolute path of CSV file representing an adjacency matrix.
 * @type {string}
 */
filePath = "./a.csv";

/**
 * should be either a number in range of adjacency matrix's index
 * or ONE character ranged ['a', 'z'] | ['A', 'Z']
 * @type {string|number}
 *
 */
from = 'a';

/**
 * should be either a number in range of adjacency matrix's index
 * or ONE character ranged ['a', 'z'] | ['A', 'Z'].
 * The type should be consistent with from's type.
 * @type {typeof from}
 */
to = 'd';
//------------------------------------End Customize--------------------------------------//

nameType = typeof from;
const utilMod = require('./utility');

utilMod.readFromCSV("./a.csv", (graph) => {
    // initialize a parent-node matrix:
    let intermediate = [];
    for (let i = 0; i < graph.length; i++){
        let row = [];
        for (let j = 0; j < graph[i].length; j++){
            row.push(-1);
        }
        intermediate.push(row);
    }
    for (let k = 0; k < graph.length; k++){
        for (let i = 0; i < graph.length; i++){
            for (let j = 0; j < graph[i].length; j++){ // should be equal to graph.length
                if (graph[i][j] > graph[i][k] + graph[k][j]){
                    graph[i][j] = graph[i][k] + graph[k][j];
                    intermediate[i][j] = k;
                }
            }
        }
    }
    console.log(graph);

    utilMod.backTrack(intermediate, utilMod.encode(from), utilMod.encode(to), (result) => {
        console.log("shortest path from " + 1 + " to " + 3);
        console.log(utilMod.decode(from, nameType));
        utilMod.printBinaryTree(result);
        console.log(utilMod.decode(to, nameType));
    });

});

