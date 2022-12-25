const _ = require('lodash');
const defs = require('./defs');

class Block {

    id;
    rows = [];
    cols = [];
    cells = [];

    constructor(id, rows, cols, cells) {
        this.id = id;
        this.rows = rows;
        this.cols = cols;

        this.setCellValues(cells);
    }

    setCellValues(cells) {
        console.log('rows', this.rows);
        console.log('cols', this.cols);
        _.forEach(this.rows, rowIndex => {
            _.forEach(this.cols, colIndex => {
                this.cells.push(cells[rowIndex][colIndex]);
            });
        });

        console.log('test', this.id, this.cells);
    }

    isEqualToBlock(block) {
        return _.isEqual(block.rows, this.rows) && _.isEqual(block.cols, this.cols);
    }
}

module.exports = Block;