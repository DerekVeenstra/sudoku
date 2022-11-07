class Cell {

    value;
    rowIndex;
    colIndex;
    notes = [];

    constructor(value, rowIndex, colIndex) {
        this.value = value;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
    }
}

module.exports = Cell;