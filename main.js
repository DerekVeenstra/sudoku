const _ = require('lodash');
const GameParser = require('./GameParser');
const defs = require('./defs');
const utils = require('./utils');
const strategies = require('./strategies');
const sampleGames = require('./sampleGames');


function main() {
    const game = GameParser.parseGame(sampleGames.game2);

    console.log(utils.prettyPrintGame(game));

    let operationLog = [];
    operationLog = strategies.solve(game);
   
    console.log('operation log', operationLog);
    console.log(`Operations complete, solution was found to be ${utils.isSolutionValid(game) ? 'valid' : 'invalid'}.`);
    console.log(utils.prettyPrintGame(game));
}

main();