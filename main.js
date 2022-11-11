const _ = require('lodash');
const GameParser = require('./GameParser');
const defs = require('./defs');
const utils = require('./utils');
const sampleGames = require('./sampleGames');

const linearGuessStrategy = require('./strategies/linearGuessStrategy');
const finalCompletionStrategy = require('./strategies/finalCompletionStrategy');

const allStrategies = [ linearGuessStrategy, finalCompletionStrategy ];


function main() {
    const game = GameParser.parseGame(sampleGames.game3);

    console.log(utils.prettyPrintGame(game));

    let operationLog = solve(game);
   
    console.log('operation log', operationLog);
    console.log(`Operations complete, solution was found to be ${utils.isSolutionValid(game) ? 'valid' : 'invalid'}.`);
    console.log(utils.prettyPrintGame(game));
}

/**
 * Runs all strategies until no more values are able to be found
 * @returns operation logs of the run
 */
 function solve(game) {
    const operationLog = [];
    let wasValueFound;

    do {   
        wasValueFound = false;

        _.forEach(allStrategies, strategy => {
            const strategyResult = strategy.run(game);

            if (!_.isEmpty(strategyResult.operationLog)) {
                operationLog.push(...strategyResult.operationLog);
            }
    
            if (strategyResult.wasValueFound) {
                wasValueFound = true;
            }
        })
    } while (wasValueFound);

    return operationLog;
}

main();