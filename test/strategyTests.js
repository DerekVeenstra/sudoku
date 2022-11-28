const _ = require('lodash');
const expect = require('chai').expect;
const GameParser = require('../GameParser');
const utils = require('../utils')
const sampleGames = require('../sampleGames');
const main = require('../main');

const linearGuessStrategy = require('../strategies/linearGuessStrategy');
const finalCompletionStrategy = require('../strategies/finalCompletionStrategy');
const nakedSingleStrategy = require('../strategies/nakedSingleStrategy');
const resolveNotesStrategy = require('../strategies/resolveNotesStrategy');

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

const finalCompletionAdvancedCaseRowsGame =
`
  3   789
   1     
         
 1       
         
         
         
         
         
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

const finalCompletionAdvancedCaseColsGame =
`
         
   1     
3        
 1       
         
         
7        
8        
9        
`;

const finalCompletionBasicCaseBlocksGame =
`
 23      
456      
789      
         
         
         
         
         
         
`;

const finalCompletionAdvancedCaseBlocksGame =
`
  3      
4  1     
7 9      
 1       
         
         
         
         
         
`;

const nakedSingleBasicCaseGame =
`
 23 45   
 67      
         
8        
9        
         
         
         
         
`;

const emptyGame =
`
         
         
         
         
         
         
         
         
         
`;

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
            const game = GameParser.parseGame(sampleGames.easyGame1);
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

        // The advanced case for final completion (rows) is to see if the number can only fit into one cell 
        // due to the remaining cells being prevented from being that number due to it existing in other cols or blocks
        it('should solve for the advanced case for rows', function() {
            const game = GameParser.parseGame(finalCompletionAdvancedCaseRowsGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[0][1].value).to.equal(null);
            expect(game.rows[3][1].value).to.equal('1');
            expect(game.rows[1][3].value).to.equal('1');
            
            const result = finalCompletionStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });

        // The advanced case for final completion (cols) is to see if the number can only fit into one cell 
        // due to the remaining cells being prevented from being that number due to it existing in other rows or blocks
        it('should solve for the advanced case for cols', function() {
            const game = GameParser.parseGame(finalCompletionAdvancedCaseColsGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[1][0].value).to.equal(null);
            expect(game.rows[3][1].value).to.equal('1');
            expect(game.rows[1][3].value).to.equal('1');
            
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

        // The advanced case for final completion (blocks) is to see if the number can only fit into one cell 
        // due to the remaining cells being prevented from being that number due to it existing in other rows or cols
        it('should solve for the advanced case for blocks', function() {
            const game = GameParser.parseGame(finalCompletionAdvancedCaseBlocksGame);
            expect(game.rows[0][0].value).to.equal(null);
            expect(game.rows[3][1].value).to.equal('1');
            expect(game.rows[1][3].value).to.equal('1');
            
            const result = finalCompletionStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });
    });

    describe('nakedSingle', function() {

        // The basic case of the naked single strategy is to look at a given cell's possible values by checking
        // what numbers are already in use in the cell's row, col and block. For example,
        // |x|2|3| |4|5|..
        // | |6|7|..
        // | | | |..
        // |8|..
        // |9|..
        // The cell value for x must be 1 since all other numbers are used in that cell's row, col and block.

        it('should find naked single cell values', function() {
            const game = GameParser.parseGame(nakedSingleBasicCaseGame);
            expect(game.rows[0][0].value).to.equal(null);
            
            const result = nakedSingleStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });
    });

    describe('resolveNotes', function() {

        it.only('should set a cell value if it has the only note for a given number', function() {
            const game = GameParser.parseGame(emptyGame);
            
            game.rows[0][0].setNoteNumbers('1');
            expect(game.rows[0][0].notes).to.eql([ '1' ]);
            
            const result = resolveNotesStrategy.run(game);
            expect(result.operationLog.length).to.equal(1);

            expect(game.rows[0][0].value).to.equal('1');
        });
    });

});

describe('sample games', function() {
    it('should successfully solve all sample games', function() {
        _.forOwn(sampleGames, sampleGame => {
            const game = GameParser.parseGame(sampleGame);
            main.solve(game);
            expect(utils.isSolutionValid(game)).to.be.true;
        })
    });
});