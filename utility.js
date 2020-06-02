// this utility module contains method to convert csv file into matrix.
const fsMod = require('fs');

col_seperators = [' ', ','];
row_seperators = ['\n', '\r'];

const getNextToken = (datas, seperators) => {
    let index = 0;
    if (isSeperator(datas[0], seperators)){ // take a seperator
        while (isSeperator(datas[index], seperators) && index < datas.length){
            index ++;
        }
    } else { // take a word
        while (!(isSeperator(datas[index], seperators)) && index < datas.length){
            index ++;
        }
    }
    return datas.substring(0, index);
}

const isSeperator = (ch, seperators) => {
    result = false;
    for (let ele of seperators){
        if (ele === ch) {result = true; break;}
    }
    return result;
}

const readFromCSV = (filePath, callback) => {
    let readStream = fsMod.createReadStream(filePath);
    let data = "";
    readStream.on('data', chunk => {
        data += chunk;
    });
    readStream.on('end', () => {
        // now data is prepared.
        readStream.close();
        let matrix = [];
        while (data.length > 0){
            let rowData = getNextToken(data, row_seperators);
            data = data.substring(rowData.length);
            if (!isSeperator(rowData[0], row_seperators)){ // if the extracted thing is not \n
                let row = [];
                while (rowData.length > 0) {
                    let colData = getNextToken(rowData, col_seperators);
                    rowData = rowData.substring(colData.length);
                    if (!isSeperator(colData[0], col_seperators)){
                        // convert colData into number.
                        if (colData.toLowerCase() === "inf"){
                            colData = Number.POSITIVE_INFINITY;
                        } else {
                            colData = parseFloat(colData);
                        }
                        row.push(colData); // push 1 data to a row
                    }
                }
                matrix.push(row); // push a row to matrix
            }
        }
        callback(matrix);
    });
}

class Tree {
    constructor(root) {
        this.root = root;
        this.children = [];
    }
    addChildren(child, pos){
        this.children[pos] = child;
    }
    appendChildren(child, direction){
        switch (direction) {
            case 1: this.children.push(child); break;
            case 0: this.children[this.children.length / 2] = child; break;
            case -1: this.children.unshift(child); break;
            default: {}
        }
    }
    numberOfChildren(){
        return this.children.length;
    }
    getChildren(index){
        return this.children[index];
    }
    getRoot(){
        return this.root;
    }
}



const backTrack = (intermediate, from, to, callback) => {
    if (intermediate[from][to] === -1){
        callback(new Tree(-1));
    } else {
        let k = intermediate[from][to]
        let backtrackTree = new Tree(k);
        backTrack(intermediate, from, k, (result) => {
            backtrackTree.appendChildren(result, 1);
        })
        backTrack(intermediate, k, to, (result) => {
            backtrackTree.appendChildren(result, 1);
        })
        callback(backtrackTree);
    }
}

const printBinaryTree = (tree) => {
    if (tree.getRoot() !== -1) {
        if (tree.numberOfChildren() === 2) {
            printBinaryTree(tree.getChildren(0));
        }
        console.log(decode(tree.getRoot(), nameType));
        if (tree.numberOfChildren() !== 0) {
            printBinaryTree(tree.getChildren(tree.numberOfChildren() - 1));
        }
    } else {
        console.log('-');
    }
}

const encode = (ch) => {
    if (typeof ch === 'string'){
        return ch.toLowerCase().charCodeAt(0) - 97;
    }
    return ch;
}

const decode = (num, originalType) => {
    if (typeof num !== originalType && typeof num === "number") {
        return String.fromCharCode(num + 97);
    }
    return num;
}

module.exports = {
    readFromCSV : readFromCSV,
    backTrack : backTrack,
    printBinaryTree : printBinaryTree,
    Tree : Tree,
    encode : encode,
    decode : decode
}

