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

        const clearNotesFromRowColOperationLog = this.clearNotesFromRowCol(game);
        if (!_.isEmpty(clearNotesFromRowColOperationLog)) {
            operationLog.push(...clearNotesFromRowColOperationLog);
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
    clearNotesFromRowCol : function(game) {
        const operationLog = [];

        _.forEach(game.blocks, block => {
            const blockCells = utils.getBlockCellArray(game, block);

            _.forEach(defs.numbers, number => {
                const cellsWithNoteNumber = _.filter(blockCells, cell => _.includes(cell.notes, number));
                
                if (!_.isEmpty(cellsWithNoteNumber) && cellsWithNoteNumber.length === 2) {
                    // The cells are on the same row, clear that row of that number in cell notes (other than the cells we found)
                    if (cellsWithNoteNumber[0].rowIndex === cellsWithNoteNumber[1].rowIndex) {
                        const rowIndex = cellsWithNoteNumber[0].rowIndex;
                        _.forEach(game.rows[rowIndex], cell => {
                            if (cell.colIndex !== cellsWithNoteNumber[0].colIndex && cell.colIndex !== cellsWithNoteNumber[1].colIndex) {
                                if (_.includes(cell.notes, number)) {
                                    cell.clearNoteNumber(number);
                                    operationLog.push(`Cleared a note for number ${number} at row ${cell.rowIndex}, col ${cell.colIndex} using clear note from row strategy.`)
                                }
                            }
                        });
                    }

                    // The cells are on the same col, clear that col of that number in cell notes (other than the cells we found)
                    if (cellsWithNoteNumber[0].colIndex === cellsWithNoteNumber[1].colIndex) {
                        const colIndex = cellsWithNoteNumber[0].colIndex;
                        _.forEach(game.cols[colIndex], cell => {
                            if (cell.rowIndex !== cellsWithNoteNumber[0].rowIndex && cell.rowIndex !== cellsWithNoteNumber[1].rowIndex) {
                                if (_.includes(cell.notes, number)) {
                                    cell.clearNoteNumber(number);
                                    operationLog.push(`Cleared a note for number ${number} at row ${cell.rowIndex}, col ${cell.colIndex} using clear note from col strategy.`)
                                }
                            }
                        });
                    }
                }
            });
        });

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