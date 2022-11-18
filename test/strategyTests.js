const expect = require('chai').expect;
const GameParser = require('../GameParser');
const utils = require('../utils')
const sampleGames = require('../sampleGames');

const linearGuessStrategy = require('../strategies/linearGuessStrategy');
const finalCompletionStrategy = require('../strategies/finalCompletionStrategy');

const linearGuessBasicCaseGame =
`
   1     
  3      
 56      
1        
         
         
         
         
         
`;

const finalCompletionBasicCaseRowsGame =
`
 23456789
         
         
         
         
         
         
         
         
`;

const finalCompletionBasicCaseColsGame =
`
         
2        
3        
4        
5        
6        
7        
8        
9        
`;

const finalCompletionBasicCaseBlocksGame =
`
 23      
456      
789      
         
         
         
         
         
         
`

describe('strategies', function() {

    describe('linearGuess', function() {

        // The basic case of the linear guess strategy is to look at a block and see if the rows and columns
        // that already have that number, in addition to the other cells already having values, to see if any
        // singular cell needs to be that number. For example, in the grid below x must be 1 because the top row
        // and left column cannot be 1 and the result of the block values are already filled in.
        // | | | |1|..
        // | |x|3| |..
        // | |5|6| |..
        // |1| | | |..
        it('should solve for the basic case', function() {
            const game = GameParser.parseGame(linearGuessBasicCaseGame);
            expect(game.rows[1][1].value).to.equal(null);
            
            const result = linearGuessStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[1][1].value).to.equal('1');
        });

        it('should solve a sample easy puzzle with only the linear guess strategy', function() {
            const game = GameParser.parseGame(sampleGames.game1);
            linearGuessStrategy.run(game);
            expect(utils.isSolutionValid(game)).to.be.true;
        });
    });

    describe('finalCompletion', function() {

        // The basic case for final completion (rows) is to see if a row has all but 1 number completed
        // For example, in the grid below x must be 1 since the rest of the row is filled out
        // |x|2|3|4|5|6|7|8|9|
        it('should solve for the basic case for rows', function() {
            const game = GameParser.parseGame(finalCompletionBasicCaseRowsGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = finalCompletionStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });

        // The basic case for final completion (cols) is to see if a col has all but 1 number completed
        // For example, in the grid below x must be 1 since the rest of the col is filled out
        // |x|..
        // |2|..
        // |3|..
        // |4|..
        // |5|..
        // |6|..
        // |7|..
        // |8|..
        // |9|..
        it('should solve for the basic case for cols', function() {
            const game = GameParser.parseGame(finalCompletionBasicCaseColsGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = finalCompletionStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });

        // The basic case for final completion (blocks) is to see if a block has all but 1 number completed
        // For example, in the grid below x must be 1 since the rest of the block is filled out
        // |x|2|3|..
        // |4|5|6|..
        // |7|8|9|..
        it('should solve for the basic case for blocks', function() {
            const game = GameParser.parseGame(finalCompletionBasicCaseBlocksGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = finalCompletionStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });
    });

});