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

        // if there is a note pair (two numbers that have notes in two cells of a block)
            // if there is a third number as part of a note pair, it can be removed since the note pair must contain both numbers
            // if there is a note pair in a row, block or col, can it resolve the remainder of the row col or block? Similar to linear guess.

        const resolveNotesFromRowColOperationLog = this.resolveNotesFromRowCol(game);
        if (!_.isEmpty(resolveNotesFromRowColOperationLog)) {
            operationLog.push(...resolveNotesFromRowColOperationLog);
        }

        const setSingleNoteValueOperationLog = this.setSingleNoteValue(game);
        if (!_.isEmpty(setSingleNoteValueOperationLog)) {
            operationLog.push(...setSingleNoteValueOperationLog);
        }

        return operationLog;
    },    

    /**
     * If two notes of the same number are in the same block, and they're on the same row or col, clear the row or
     * col from that note number across other blocks
     */
    resolveNotesFromRowCol : function(game) {
        const operationLog = [];

        _.forEach(game.blocks, block => {
            const blockCells = utils.getBlockCellArray(game, block);

            _.forEach(defs.numbers, number => {
                const cellsWithNoteNumber = _.filter(blockCells, cell => _.includes(cell.notes, number));
                
                if (!_.isEmpty(cellsWithNoteNumber) && cellsWithNoteNumber.length === 2) {
                    // Clear notes from rows and cols
                    const clearNotesFromRowOperationLog = this.clearNotesFromRowCol(game, cellsWithNoteNumber, number, 'row');
                    const clearNotesFromColOperationLog = this.clearNotesFromRowCol(game, cellsWithNoteNumber, number, 'col');

                    if (!_.isEmpty(clearNotesFromRowOperationLog)) {
                        operationLog.push(...clearNotesFromRowOperationLog);
                    }
                    if (!_.isEmpty(clearNotesFromColOperationLog)) {
                        operationLog.push(...clearNotesFromColOperationLog);
                    }
                    
                }
            });
        });

        return operationLog;
    },

    /**
     * Clear the row or col of the notes for that number
     * @param {*} type either 'row' or 'col'
     */
    clearNotesFromRowCol : function(game, cellsWithNoteNumber, number, type) {
        const operationLog = [];
        const primaryIndex = `${type}Index`;
        const secondaryIndex = type === 'row' ? 'colIndex' : 'rowIndex';
        const gameIndex = `${type}s`; // 'rows' or 'cols'

        if (cellsWithNoteNumber[0][primaryIndex] === cellsWithNoteNumber[1][primaryIndex]) {
            const targetIndex = cellsWithNoteNumber[0][primaryIndex];
            _.forEach(game[gameIndex][targetIndex], cell => {
                if (cell[secondaryIndex] !== cellsWithNoteNumber[0][secondaryIndex] && cell[secondaryIndex] !== cellsWithNoteNumber[1][secondaryIndex]) {
                    if (_.includes(cell.notes, number)) {
                        cell.clearNoteNumber(number);
                        operationLog.push(`Cleared a note for number ${number} at row ${cell.rowIndex}, col ${cell.colIndex} using clear note from ${type} strategy.`)
                    }
                }
            });
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