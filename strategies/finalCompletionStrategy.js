const _ = require('lodash');
const defs = require('../defs');
const utils = require('../utils');

module.exports = {
    /**
     * * Runs the final completion strategy until no more values are able to be found
     * If any rows, columns or blocks have 8 values, set the 9th to be the missing value
     * TODO: tests
     * @returns operation logs of the pass
     */
     run : function(game) {
        const operationLog = [];
        let wasValueFoundDuringPass = true;
        
        while(wasValueFoundDuringPass) {
            // TODO, WTF IS NUMBER NOT DOING ANYTHING

            _.forEach(defs.numbers, number => {
                rowsAndColsOperationLog = this.setFinalCompletionForRowsAndCols(game);
                if (!_.isEmpty(rowsAndColsOperationLog)) {
                    operationLog.push(...rowsAndColsOperationLog); 
                }

                blocksOperationLog = this.setFinalCompletionForBlocks(game);
                if (!_.isEmpty(blocksOperationLog)) {
                    operationLog.push(...blocksOperationLog); 
                }
            });
    
            wasValueFoundDuringPass = !_.isEmpty(rowsAndColsOperationLog) || !_.isEmpty(blocksOperationLog);
        }

        return { operationLog };
    },

    setFinalCompletionForRowsAndCols : function(game) {
        const operationLog = [];
        const operationTypes = [ 'rows', 'cols' ];

        _.forEach(operationTypes, operationType => {
            for (let i = 0; i < defs.gameLength; i++) {
                const values = _.map(game[operationType][i], 'value');
                const missingValues = utils.getMissingValues(values);

                // for each missing value, is it limited to a single cell in the row or column
                _.forEach(missingValues, missingValue => {
                    let validCells = _.filter(game[operationType][i], cell => !cell.value && utils.canCellContainNumber(game, cell, missingValue));

                    // If the number is isolated to a single cell in the row or col, that cell must contain that value
                    if (validCells.length === 1) {
                        validCells = validCells[0];
                        validCells.setValue(missingValue);
                        operationLog.push(`Found a ${missingValue} at row ${validCells.rowIndex}, col ${validCells.colIndex} using final completion (${operationType}) strategy.`);
                    }
                }); 
            }
        });

        return operationLog;
    },

    /**
     * 
     * TODO: Add notes when othere are only two values left in the block
     * TODO: tests
     */
    setFinalCompletionForBlocks : function(game) {
        const operationLog = [];

        _.forEach(game.blocks, block => {
            for (let i = 0; i < defs.gameLength; i++) {
                const blockCellValues = _.map(game.blocks[i].cells, 'value');
                const missingValues = utils.getMissingValues(blockCellValues);

                if (missingValues.length === 2) {
                    const blockCellsWithoutValues = _.filter(game.blocks[i].cells, cell => !cell.value);
                    _.forEach(blockCellsWithoutValues, cell => cell.setNoteNumbers(missingValues));
                }

                if (missingValues.length === 1) {
                    const missingValue = missingValues[0];
                    let cellToUpdate = _.filter(game.blocks[i].cells, cell => !cell.value);
    

                    if (_.isEmpty(cellToUpdate) || cellToUpdate.length > 1) {
                        console.log(cellToUpdate);
                        throw 'setFinalCompletionForBlocks: Expected one missing value cell but it was either more than one or empty';
                    }
    
                    cellToUpdate = cellToUpdate[0];
                    cellToUpdate.setValue(missingValue);
                    operationLog.push(`Found a ${missingValue} at row ${cellToUpdate.rowIndex}, col ${cellToUpdate.colIndex} using final completion (blocks) strategy.`);
                }
            }
        });

        return operationLog;
    },
}