const _ = require('lodash');

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

    setNoteNumbers(numbers) {
        if (!numbers) {
            throw 'Can only set numbers as notes';
        }

        if (!_.isArray(numbers)) {
            numbers = [ numbers ];
        }

        _.forEach(numbers, number => {
            if (!_.includes(this.notes, number)) {
                this.notes.push(number);
            }
        });
    }

    clearNoteNumber(number) {
        _.remove(this.notes, number);
    }

    setValue(value) {
        this.value = value;
        this.notes = [];
    }
}

module.exports = Cell;