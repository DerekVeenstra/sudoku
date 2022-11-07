const _ = require('lodash');
const defs = require('./defs');
const utils = require('./utils');

module.exports = {
    /**
     *  Generates notes and values based on intersection of rows and columns for the given number
     *  Returns true if a value was found
     */
    linearGuess : function(game, number) {
        // get all rows that contain this number
        const rowIndexes = [];
        for (let i = 0; i < defs.gameLength; i++) {
            const rowValues = _.map(game.rows[i], 'value');
            if (_.includes(rowValues, number)) {
                rowIndexes.push(i);
            }
        }

        // get all columns that contain this number
        const colIndexes = [];
        for (let i = 0; i < defs.gameLength; i++) {
            const colValues = _.map(game.cols[i], 'value');
            if (_.includes(colValues, number)) {
                colIndexes.push(i);
            }
        }

        // get all blocks that don't contain this number
        const blocksWithoutNumber = [];
        _.forEach(game.blocks, block => {
            if (!utils.doesBlockIncludeNumber(game, block, number)) {
                blocksWithoutNumber.push(block);
            }
        });

        if (_.isEmpty(blocksWithoutNumber)) {
            return false;
        }

        let operationLogs = [];

        // see if those blocks have rows or columns forcing the number to exist
        // update the operation log and set the new value to the cell if a value is found
        _.forEach(blocksWithoutNumber, block => {
            let newValues = this.findLinearGuessBlockValues(game, block, number, rowIndexes, colIndexes);

            if (newValues) {
                if (!_.isArray(newValues)) {
                    newValues = [ newValues ];
                }

                operationLogs = _.map(newValues, newValue => {
                    return `Found a ${number} at row ${newValue.rowIndex}, col ${newValue.colIndex} using linear guess strategy.`;
                });

                _.forEach(newValues, newValue => {
                    game.rows[newValue.rowIndex][newValue.colIndex].value = number;
                });
            }
        });

        return operationLogs;
    },

    /**
     * Given rows and columns containing the target number, determine if the block has the given number value in a cell
     * TODO: Notes
     */
    findLinearGuessBlockValues : function(game, block, number, rowIndexesWithNumber, colIndexesWithNumber) {

        // Validate that the given number isn't already in the block
        if (utils.doesBlockIncludeNumber(game, block, number)) {
            throw ('Block already contains number');
        }

        const cellArray = utils.getBlockCellArray(game, block);

        // Remove all cells that are on the row or col of the number from other blocks, or if they already have a value assigned
        _.remove(cellArray, cell => cell.value || _.includes(rowIndexesWithNumber, cell.rowIndex) || _.includes(colIndexesWithNumber, cell.colIndex));

        // If there are only two cells left, add notes UNTESTED
        if (cellArray.length === 2) {
            _.map(cellArray, cell => {
                cell.notes.push(number);
            });

            return;
        }

        // If there is only one cell left, that value is the number!
        if (cellArray.length === 1) {
            return cellArray[0];
        }
    }
}