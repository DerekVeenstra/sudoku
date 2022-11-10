const expect = require('chai').expect;
const GameParser = require('../GameParser');
const utils = require('../utils')
const sampleGames = require('../sampleGames');
const strategies = require('../strategies');

describe('strategies', function() {

    describe('linearGuess', function() {

        it('should solve a sample easy puzzle with only the linear guess strategy', function() {
            const game = GameParser.parseGame(sampleGames.game1);
            strategies.runLinearGuessStrategy(game);
            expect(utils.isSolutionValid(game)).to.be.true;
        });

    });

});