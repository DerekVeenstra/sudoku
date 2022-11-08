const _ = require('lodash');
const defs = require('./defs');

module.exports = {
    /**
 * This is probably a dumb way to do this, blocks should have cell references. Or just run this once and re-populate Block object
 */
    getBlockCellArray : function(game, block) {
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

    prettyPrintGame : function(game) {
        let output = '';
        let line = '\n--------------------------------------\n';
        
        for (let i = 0; i < defs.gameLength; i++) {
            output += line;
            for (let j = 0; j < defs.gameLength; j ++) {
                output += `| ${game.rows[i][j].value ? game.rows[i][j].value : ' '} `;
            }

            output += '|';
        }

        output += line;

        return output;
    }
}