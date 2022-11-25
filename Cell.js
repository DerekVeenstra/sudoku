const _ = require('lodash');
const utils = require('./utils');

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
        _.pull(this.notes, number);
    }

    setValue(game, value) {
        this.value = value;
        this.notes = [];

        utils.clearNotesForCellValue(game, this, value);
    }
}

module.exports = Cell;