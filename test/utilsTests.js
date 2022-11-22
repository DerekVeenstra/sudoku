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

const canCellContainNumberValidGame =
`
         
         
         
         
         
         
         
         
         
`;

describe('utils', function() {

    describe('canCellContainNumber', function () {

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

        // If the top left cell doesn't have a 1 in its row, col or block, it can be a 1
        it('should return true if the cell is not on a row, col or block with the number', function() {
            const game = GameParser.parseGame(canCellContainNumberValidGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = utils.canCellContainNumber(game, game.rows[0][0], '1');
            expect(result).to.be.true;
        });


    })
});