const _ = require('lodash');
const defs = require('./defs');

module.exports = {
    /**
     * This is probably a dumb way to do this, blocks should have cell references. Or just run this once and re-populate Block object
     */
    getBlockCells : function(game, block) {
        if (!block || !block.rows || !block.cols) {
            throw 'Block not properly defined';
        }

        const cellArray = [];
        _.forEach(block.rows, row => {
            _.forEach(block.cols, col => {
                cellArray.push(game.rows[row][col]);
            });
        });

        return cellArray;
    },

    numberOfUnknownValues : function(game) {
        let count = 0;

        for(let i = 0; i < defs.gameLength; i++) {
            for(let j = 0; j < defs.gameLength; j++) {
                if (!game.rows[i][j].value) {
                    count++;
                }
            }
        }

        return count;
    },

    doesBlockIncludeNumber : function(game, block, number) {
        let isNumberFound = false;
        _.forEach(block.rows, row => {
            _.forEach(block.cols, col => {
                if (game.rows[row][col].value === number) {
                    isNumberFound = true;
                }
            });
        });
    
        return isNumberFound;
    },

    getBlockThatCellBelongsTo : function(game, cell) {
        return _.find(game.blocks, block => _.includes(block.rows, cell.rowIndex) && _.includes(block.cols, cell.colIndex));
    },

    /**
     * For a given cell and number, remove that number from the notes of the cell's row, col and block
     */
    clearNotesForCellValue : function(game, cell, number) {
        const rowCells = game.rows[cell.rowIndex];
        const colCells = game.cols[cell.colIndex];
        
        const cellBlock = this.getBlockThatCellBelongsTo(game, cell);
        const blockCells = this.getBlockCells(game, cellBlock);

        _.forEach([ ...rowCells, ...colCells, ...blockCells ], cell => cell.clearNoteNumber(number));
    },

    /**
     * Return rows or cols that have note pairs for a provided number.
     * Exclusion block will ignore any note pairs within that block if provided, this is important
     * since note pairs within the block should not be used to exclude potential cells that the number could be in
     * @param type is either 'row' or 'col'
     */
    getRowColCoveredByNotes : function(game, exclusionBlock, number, type) {
        if (!type || (type !== 'row' && type !== 'col')) {
            throw 'type param either not provided or invalid';
        }
        
        const primaryIndex = `${type}Index`;
        const indexesCoveredByNotes = [];
        
        _.forEach(game.blocks, block => {
            // Skip the exclusion block 
            if (_.isEqual(block, exclusionBlock)) {
                return;
            }

            const blockCells = this.getBlockCells(game, block);
            const cellsWithNoteNumber = _.filter(blockCells, cell => _.includes(cell.notes, number));
            
            if (!_.isEmpty(cellsWithNoteNumber) && cellsWithNoteNumber.length === 2 
                && cellsWithNoteNumber[0][primaryIndex] === cellsWithNoteNumber[1][primaryIndex]) {
                indexesCoveredByNotes.push(cellsWithNoteNumber[0][primaryIndex]);
            }
        });

        return indexesCoveredByNotes;
    },

    canCellContainNumber : function(game, cell, number) {
        if (cell.value) {
            throw 'Cell already has a value';
        }

        const cellBlock = this.getBlockThatCellBelongsTo(game, cell);

        // Does the row already contain the number?
        if (_.includes(_.map(game.rows[cell.rowIndex], 'value'), number)) {
            return false;
        }

        // Does the col already contain the number?
        if (_.includes(_.map(game.cols[cell.colIndex], 'value'), number)) {
            return false;
        }

        // Does the row have a note pair with that number?
        if (_.includes(this.getRowColCoveredByNotes(game, cellBlock, number, 'row'), cell.rowIndex)) {
            return false;
        }

        // Does the col have a note pair with that number?
        if (_.includes(this.getRowColCoveredByNotes(game, cellBlock, number, 'col'), cell.colIndex)) {
            return false;
        }

        // Does the block already contain the number?
        const blockCellArray = this.getBlockCells(game, cellBlock);
        if (_.includes(_.map(blockCellArray, 'value'), number)) {
            return false;
        }

        // Does the block have a note pair of that number?
        const cellsWithNoteNumber = _.filter(blockCellArray, cell => _.includes(cell.notes, number));
        if (!_.isEmpty(cellsWithNoteNumber) && cellsWithNoteNumber.length === 2) {
            // If the block note numbers are on the cell we're looking at, then that cell is still valid for that number
            if (!cellsWithNoteNumber[0].isEqualToCell(cell) && !cellsWithNoteNumber[1].isEqualToCell(cell)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Ensure that all rows, columns and blocks have unique numbers
     * Returns false if the game is unfinished or if the solution is invalid
     */
    isSolutionValid : function(game) {    
        return this.isCompleteSolution(game) && this.areRowsValid(game) && this.areColsValid(game) && this.areBlocksValid(game);
    },
    
    isCompleteSolution : function(game) {
        return this.numberOfUnknownValues(game) === 0;
    },

    areRowsValid : function(game) {
        let rowNumbers = [];
         for (let i = 0; i < defs.gameLength; i++) {
             for (let j = 0; j < defs.gameLength; j++) {
                 if (!game.rows[i][j].value) {
                     return false;
                 }
                 rowNumbers.push(game.rows[i][j].value);
             }
 
             if (!_.isEqual(rowNumbers.sort(), defs.numbers)) {
                 return false;
             }
             rowNumbers = [];
         }

         return true;
    },

    areColsValid : function(game) {
        let colNumbers = [];
        for (let i = 0; i < defs.gameLength; i++) {
            for (let j = 0; j < defs.gameLength; j ++) {
                if (!game.cols[i][j].value) {
                    return false;
                }
                colNumbers.push(game.cols[i][j].value);
            }

            if (!_.isEqual(colNumbers.sort(), defs.numbers)) {
                return false;
            }
            colNumbers = [];
        }

        return true;
    },

    areBlocksValid : function(game) {
        let result = true;
        let blockNumbers = [];

        _.forEach(game.blocks, block => {
            const blockCells = this.getBlockCells(game, block);
            blockNumbers = [];
            
            for (let i = 0; i < defs.gameLength; i++) {
                if (!blockCells[i].value) {
                    result = false;
                }
                blockNumbers.push(blockCells[i].value);
            }

            if (!_.isEqual(blockNumbers.sort(), defs.numbers)) {
                result = false;
            };
        });

        return result;
    },

    /**
     * Return any missing values from a row, col or block
     * @param {*} set - A row, col or block
     */
    getMissingValues : function(set) {
        return _(defs.numbers)
            .map(number => {
                if (!_.includes(set, number)) {
                    return number;
                }}
            )
            .filter(value => !!value)
            .valueOf();
    },

    prettyPrintGame : function(game) {
        let output = '';
        let border = '\n-------------------------------------------------------\n';
        let dividers = '\n|     |     |     |     |     |     |     |     |     |';
        
        for (let i = 0; i < defs.gameLength; i++) {
            output += border;

            for (let j = 0; j < defs.gameLength; j++) {
                const noteOutput = _.join(game.rows[i][j].notes, '');
                output += `|${noteOutput}`;
                output += ' '.repeat(5 - noteOutput.length);
            }

            output += '|\n';

            for (let j = 0; j < defs.gameLength; j++) {
                output += `|  ${game.rows[i][j].value ? game.rows[i][j].value : ' '}  `;
            }

            output += '|';
            output += dividers;
        }

        output += border;

        return output;
    }
}