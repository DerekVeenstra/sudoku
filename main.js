const _ = require('lodash');
const GameParser = require('./GameParser');
const defs = require('./defs');
const utils = require('./utils');
const strategies = require('./strategies');
const sampleGames = require('./sampleGames');

const operationLog = [];

function main() {
    const game = GameParser.parseGame(sampleGames.game1);

    console.log(utils.prettyPrintGame(game));

    let foundLinearGuess = false;
    do {

        console.log('Number of unknown values before strategy run', utils.numberOfUnknownValues(game));
        _.forEach(defs.numbers, number => {
            linearGuessOperationLogs = strategies.linearGuess(game, number);

            if (!_.isEmpty(linearGuessOperationLogs)) {
                operationLog.push(...linearGuessOperationLogs); 
            }
        });

        foundLinearGuess = !_.isEmpty(linearGuessOperationLogs);

        console.log('Number of unknown values after strategy run', utils.numberOfUnknownValues(game));

    } while (foundLinearGuess)
   
    console.log('operation log', operationLog);
    console.log(`Operations complete, solution was found to be ${utils.isSolutionValid(game) ? 'valid' : 'invalid'}.`);
    console.log(utils.prettyPrintGame(game));
}

main();