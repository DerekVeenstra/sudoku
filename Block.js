const defs = require('./defs');

class Block {

    rows = [];
    cols = [];
    cells = [];

    constructor(rows, cols, game) {
        this.rows = rows;
        this.cols = cols;

        this.setCellValues(game);
    }

    setCellValues(game) {
        for(let i = 0; i < this.rows.length; i++) {
            for(let j = j < this.cols.length; j++) {
                this.cells.push(game[i][j]);
            }
        }

        console.log('this.cells', this.cells);
    }
}

module.exports = Block;