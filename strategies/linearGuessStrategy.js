const _ = require('lodash');
const defs = require('../defs');
const utils = require('../utils');

module.exports = {
    /**
     * Runs the linear guess strategy until no more values are able to be found
     * @returns operation logs of the pass
     */
     run : function(game) {
        const operationLog = [];
        let wasOpLogGeneratedDuringPass = true;
        
        while(wasOpLogGeneratedDuringPass) {
            _.forEach(defs.numbers, number => {
                linearGuessOperationLogs = this.linearGuessForNumber(game, number);
                if (!_.isEmpty(linearGuessOperationLogs)) {
                    operationLog.push(...linearGuessOperationLogs); 
                }
            });
            wasOpLogGeneratedDuringPass = !_.isEmpty(linearGuessOperationLogs);
        }

        return operationLog;
    },
    
    /**
     *  Generates notes and values based on intersection of rows and columns for the given number
     *  Returns operation logs
     */
    linearGuessForNumber : function(game, number) {
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
            // cloning index variables here since operatintg on them in the function would change it for each block
            let blockOpLog = this.setLinearGuessBlockValues(game, block, number, _.clone(rowIndexes), _.clone(colIndexes));
            if(!_.isEmpty(blockOpLog)) {
                operationLogs.push(...blockOpLog);
            }
        });

        return operationLogs;
    },

    /**
     * Given rows and columns containing the target number, determine if the block has the given number value in a cell
     * This function uses side effects to set values on Cells when it finds the value or notes
     */
    setLinearGuessBlockValues : function(game, block, number, rowIndexesWithNumber, colIndexesWithNumber) {
        const operationLogs = [];
        
        // Validate that the given number isn't already in the block
        if (utils.doesBlockIncludeNumber(game, block, number)) {
            throw ('Block already contains number');
        }

        // Get row and col indexes that are covered by note pairs external to the block
        rowIndexesWithNumber.push(...utils.getRowColCoveredByNotes(game, block, number, 'row'));
        colIndexesWithNumber.push(...utils.getRowColCoveredByNotes(game, block, number, 'col'));

        const cellArray = utils.getBlockCells(game, block);

        // Remove all cells that are on the row or col of the number from other blocks, or if they already have a value assigned
        _.remove(cellArray, cell => cell.value || _.includes(rowIndexesWithNumber, cell.rowIndex) || _.includes(colIndexesWithNumber, cell.colIndex));

        // If there are only two cells left, add notes
        if (cellArray.length === 2) {
            _.forEach(cellArray, cell => {
                if (!cell.hasNoteNumber(number)) {
                    cell.setNoteNumbers(number);
                    operationLogs.push(`Set a note for ${number} at row ${cell.rowIndex}, col ${cell.colIndex} using linear guess strategy.`);
                }
            });
        }

        // If there is only one cell left, that value is the number!
        if (cellArray.length === 1) {
            const newValue = cellArray[0];
            game.rows[newValue.rowIndex][newValue.colIndex].setValue(game, number);
            
            operationLogs.push(`Found a ${number} at row ${newValue.rowIndex}, col ${newValue.colIndex} using linear guess strategy.`);
        }

        return operationLogs;
    },
}