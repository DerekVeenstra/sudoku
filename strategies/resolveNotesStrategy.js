const _ = require('lodash');
const defs = require('../defs');
const utils = require('../utils');

module.exports = {
    /**
     * Runs the resolve notes strategy until no more values or note changes can be found
     * @returns operation logs of the pass
     */
     run : function(game) {
        const operationLog = [];

        let wasOpLogGeneratedDuringPass = true;
        
        while(wasOpLogGeneratedDuringPass) {
                opLogs = this.resolveNotes(game);
                if (!_.isEmpty(opLogs)) {
                    operationLog.push(...opLogs); 
                }
            wasOpLogGeneratedDuringPass = !_.isEmpty(opLogs);

            if (wasOpLogGeneratedDuringPass) {
                wasAnyValueFound = true;
            }
        }

        return { operationLog };
    },
    
    resolveNotes : function(game) {
        const operationLog = [];

        // if there are two notes forming a row or col, remove that note from the rest of the row or col

        // if there is a note pair (two numbers that have notes in two cells of a block)
            // if there is a third number as part of a note pair, it can be removed since the note pair must contain both numbers
            // if there is a note pair in a row, block or col, can it resolve the remainder of the row col or block? Similar to linear guess.

        // if there is only one of a note in a block, it must be that number

        const setSingleNoteValueOperationLog = this.setSingleNoteValue(game);
        if (!_.isEmpty(setSingleNoteValueOperationLog)) {
            operationLog.push(...setSingleNoteValueOperationLog);
        }
        


        return operationLog;
    },    

    /**
     * Find cells that have a note with the only occurance of that number in the block. That must be the cell value.
     */
    setSingleNoteValue : function(game) {
        const operationLog = [];

        _.forEach(game.blocks, block => {
            const blockCells = utils.getBlockCellArray(game, block);
            
            _.forEach(defs.numbers, number => {
                const cellsWithNoteNumber = _.filter(blockCells, cell => _.includes(cell.notes, number));

                if (!_.isEmpty(cellsWithNoteNumber) && cellsWithNoteNumber.length === 1) {
                    cellToUpdate = cellsWithNoteNumber[0];
                    cellToUpdate.setValue(game, number);
                    operationLog.push(`Found a ${number} at row ${cellToUpdate.rowIndex}, col ${cellToUpdate.colIndex} using resolve notes strategy (only note in the block).`)
                }
            });
        });

        return operationLog;
    },
}