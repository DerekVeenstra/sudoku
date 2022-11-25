const _ = require('lodash');
const GameParser = require('./GameParser');
const defs = require('./defs');
const utils = require('./utils');
const sampleGames = require('./sampleGames');

const linearGuessStrategy = require('./strategies/linearGuessStrategy');
const finalCompletionStrategy = require('./strategies/finalCompletionStrategy');
const nakedSingleStrategy = require('./strategies/nakedSingleStrategy');
const resolveNotesStrategy = require('./strategies/resolveNotesStrategy');

const allStrategies = [ linearGuessStrategy, finalCompletionStrategy, nakedSingleStrategy, resolveNotesStrategy ];


function main() {
    const game = GameParser.parseGame(sampleGames.expertGame1);

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
    let wasValueFound = true;

    while(wasValueFound) {
        wasValueFound = false;

        _.forEach(allStrategies, strategy => {
            const strategyResult = strategy.run(game);

            if (!_.isEmpty(strategyResult.operationLog)) {
                operationLog.push(...strategyResult.operationLog);
            }
    
            if (!_.isEmpty(strategyResult.operationLog)) {
                wasValueFound = true;
            }
        })
    }

    return operationLog;
}

module.exports = { solve };
main();