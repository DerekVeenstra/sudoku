const _ = require('lodash');
const defs = require('../defs');
const utils = require('../utils');

module.exports = {
    /**
     * Runs the naked single strategy until no more values are able to be found
     * @returns operation logs of the pass
     */
     run : function(game) {
        const operationLog = [];

        let wasAnyValueFound = false;
        let wasValueFoundDuringPass = true;
        
        while(wasValueFoundDuringPass) {
                opLogs = this.findNakedSingles(game);
                if (!_.isEmpty(opLogs)) {
                    operationLog.push(...opLogs); 
                }
            wasValueFoundDuringPass = !_.isEmpty(opLogs);

            if (wasValueFoundDuringPass) {
                wasAnyValueFound = true;
            }
        }

        return { wasAnyValueFound, operationLog };
    },
    
    // For each cell, see if it can only be one number based on the existance of all other possible numbers
    // from its row, col and block
    findNakedSingles : function(game) {
        const operationLog = [];

        for(let i = 0; i < defs.gameLength; i++) {
            for(let j = 0; j < defs.gameLength; j++) {
                const cell = game.rows[i][j];
                
                if (!cell.value) {
                    const rowNumbers = _(game.rows[i]).map('value').compact().valueOf();
                    const colNumbers = _(game.cols[j]).map('value').compact().valueOf();
                    
                    const cellBlock = utils.getBlockThatCellBelongsTo(game, cell);
                    const blockNumbers = _(utils.getBlockCellArray(game, cellBlock)).map('value').compact().valueOf();
                   
                    const allNumbers = _.uniq(_.concat(rowNumbers, colNumbers, blockNumbers));
                    const missingValues = utils.getMissingValues(allNumbers);

                    if (missingValues.length === 1) {
                        const missingValue = missingValues[0];
                        cell.setValue(missingValue);
                        operationLog.push(`Found a ${missingValue} at row ${cell.rowIndex}, col ${cell.colIndex} using naked single strategy.`);
                    }
                }
            }
        }

        return operationLog;
    },

    
}