const _ = require('lodash');
const defs = require('./defs');
const Cell = require('./Cell');
const Block = require('./Block');

module.exports = {
    parseGame : function(game) {
        if (game[0] === '\n') {
            game = game.slice(1);
        }
    
        const rows = this.parseRows(game);
        const cols = this.parseCols(game, rows);
        const blocks = this.parseBlocks(rows);
        
        return { rows, cols, blocks };
    },

    parseRows : function(game) {
        let rows = [];
        let row = [];
        let rowIndex = 0;
        let colIndex = 0;
        
        _.forEach(game, value => {
            if (value !== '\n') {
                row.push(new Cell(value === ' ' ? null : value, rowIndex, colIndex));
                colIndex++;
            }
            else {
                if (colIndex !== defs.gameLength) {
                    throw `Invalid number of columns in row. Found ${colIndex} but expected ${defs.gameLength}`;
                }
                rows.push(row);
                row = [];
                colIndex = 0;
                rowIndex++;
            }
        });

        if (rowIndex !== defs.gameLength) {
            throw `Invalid number of rows. Found ${rowIndex} but expected ${defs.gameLength}`;
        }
    
        return rows;
    },

    parseCols : function(game, rows) {
        let cols = [];
        let col = [];
        for (let i = 0; i < defs.gameLength; i++) {
            _.forEach(rows, row => {
                 col.push(row[i]);
            });
            cols.push(col);
            col = [];
        }
    
        return cols;
    },

    parseBlocks : function(rows) {

        return [
            new Block(1, [0, 1, 2], [0, 1, 2], rows),
            new Block(2, [0, 1, 2], [3, 4, 5], rows),
            new Block(3, [0, 1, 2], [6, 7, 8], rows),
            
            new Block(4, [3, 4, 5], [0, 1, 2], rows),
            new Block(5, [3, 4, 5], [3, 4, 5], rows),
            new Block(6, [3, 4, 5], [6, 7, 8], rows),

            new Block(7, [6, 7, 8], [0, 1, 2], rows),
            new Block(8, [6, 7, 8], [3, 4, 5], rows),
            new Block(9, [6, 7, 8], [6, 7, 8], rows),
        ];
    }
}