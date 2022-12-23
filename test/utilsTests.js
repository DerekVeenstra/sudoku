const _ = require('lodash');
const expect = require('chai').expect;
const GameParser = require('../GameParser');
const utils = require('../utils');


const canCellContainNumberRowGame =
`
   1     
         
         
         
         
         
         
         
         
`;

const canCellContainNumberColGame =
`
         
         
         
1        
         
         
         
         
         
`;

const canCellContainNumberBlockGame =
`
         
 1       
         
         
         
         
         
         
         
`;

const emptyGame =
`
         
         
         
         
         
         
         
         
         
`;

describe('utils', function() {

    describe('canCellContainNumber', function() {

        // If the top left cell is on a row with a 1, it can't be a 1
        it('should return false if the cell is on a row that contains the number', function() {
            const game = GameParser.parseGame(canCellContainNumberRowGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[0][3].value).to.equal('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is on a col with a 1, it can't be a 1
        it('should return false if the cell is on a col that contains the number', function() {
            const game = GameParser.parseGame(canCellContainNumberColGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[3][0].value).to.equal('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is in a block with a 1, it can't be a 1
        it('should return false if the cell is in a block that contains the number', function() {
            const game = GameParser.parseGame(canCellContainNumberBlockGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[1][1].value).to.equal('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is in a row with a note pair of 1, it can't be a 1
        it('should return false if the cell is in a row with a note pair of that number', function() {
            const game = GameParser.parseGame(emptyGame);
            expect(game.rows[0][0].value).to.equal(null);

            game.rows[0][3].setNoteNumbers('1');
            game.rows[0][4].setNoteNumbers('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is in a col with a note pair of 1, it can't be a 1
        it('should return false if the cell is in a col with a note pair of that number', function() {
            const game = GameParser.parseGame(emptyGame);
            expect(game.rows[0][0].value).to.equal(null);

            game.rows[3][0].setNoteNumbers('1');
            game.rows[4][0].setNoteNumbers('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is in a block with a note pair of 1, it can't be a 1
        it('should return false if the cell is in a block with a note pair of that number', function() {
            const game = GameParser.parseGame(emptyGame);
            expect(game.rows[0][0].value).to.equal(null);

            game.rows[1][1].setNoteNumbers('1');
            game.rows[2][1].setNoteNumbers('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.false;
        });

        // If the top left cell is in a block with a note pair of 1, it CAN be a 1 if the notes are on that cell
        it('should return true if the cell is in a block with a note pair of that number and the note pair is on the cell in question', function() {
            const game = GameParser.parseGame(emptyGame);
            expect(game.rows[0][0].value).to.equal(null);

            game.rows[0][0].setNoteNumbers('1');
            game.rows[2][1].setNoteNumbers('1');
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.true;
        });

        // If the top left cell doesn't have a 1 in its row, col or block, it can be a 1
        it('should return true if the cell is not on a row, col or block with the number', function() {
            const game = GameParser.parseGame(emptyGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.true;
        });
    });

    describe('clearNotesForCellValue', function() {
        
        it('should clear notes on a cell row, col and block for the provided number and cell', function() {
            const game = GameParser.parseGame(emptyGame);
            const number = '1';
            
            const targetCell = game.rows[0][4];
            const rowCell = game.rows[0][0];
            const colCell = game.rows[4][4];
            const blockCell = game.rows[1][3];
    
            rowCell.setNoteNumbers(number);
            colCell.setNoteNumbers(number);
            blockCell.setNoteNumbers(number);
            
            utils.clearNotesForCellValue(game, targetCell, number);
    
            expect(rowCell.notes).to.be.empty;
            expect(colCell.notes).to.be.empty;
            expect(blockCell.notes).to.be.empty;
        });
        
    });

    describe('getRowColCoveredByNotes', function() {
        
        it('should return the indexes covered by the row', function() {
            const game = GameParser.parseGame(emptyGame);
            const number = '1';

            game.rows[0][0].setNoteNumbers(number);
            game.rows[0][1].setNoteNumbers(number);

            game.rows[1][7].setNoteNumbers(number);
            game.rows[1][8].setNoteNumbers(number);

            const results = utils.getRowColCoveredByNotes(game, null, number, 'row');
            expect(results).to.eql([ 0, 1 ]);
        });

        it('should return the indexes covered by the col', function() {
            const game = GameParser.parseGame(emptyGame);
            const number = '1';

            game.rows[0][0].setNoteNumbers(number);
            game.rows[1][0].setNoteNumbers(number);

            game.rows[7][1].setNoteNumbers(number);
            game.rows[8][1].setNoteNumbers(number);

            const results = utils.getRowColCoveredByNotes(game, null, number, 'col');
            expect(results).to.eql([ 0, 1 ]);
        });

        it('should require a type parameter as either row or col', function() {
            const game = GameParser.parseGame(emptyGame);
            // bind is needed here since 'throw' is expecting a function, not a result
            expect(utils.getRowColCoveredByNotes.bind(game, null, '1', null)).to.throw();
            expect(utils.getRowColCoveredByNotes.bind(game, null, '1', 'test')).to.throw();
        });

        it('should not return row or col indexes within the provided exclusion block', function() {

        });
    })
});