const _ = require('lodash');
const defs = require('../defs');
const utils = require('../utils');

module.exports = {
    /**
     * Runs the resolve notes strategy until no more values or note changes can be found
     * @returns operation logs of the pass
     */
     run : function(game) {
        const operationLog = [];

        let wasOpLogGeneratedDuringPass = true;
        
        while(wasOpLogGeneratedDuringPass) {
                opLogs = this.resolveNotes(game);
                if (!_.isEmpty(opLogs)) {
                    operationLog.push(...opLogs); 
                }
            wasOpLogGeneratedDuringPass = !_.isEmpty(opLogs);

            if (wasOpLogGeneratedDuringPass) {
                wasAnyValueFound = true;
            }
        }

        return { operationLog };
    },
    
    resolveNotes : function(game) {
        const operationLog = [];

        return operationLog;
    },    
}