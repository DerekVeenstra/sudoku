const defs = require('./defs');

class Block {

    rows = [];
    cols = [];
    cells = [];

    constructor(rows, cols, cells) {
        this.rows = rows;
        this.cols = cols;

        this.setCellValues(cells);
    }

    setCellValues(cells) {
        for(let i = 0; i < this.rows.length; i++) {
            for(let j = 0; j < this.cols.length; j++) {
                this.cells.push(cells[i][j]);
            }
        }
    }
}

module.exports = Block;