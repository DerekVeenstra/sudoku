TODO List

- Establish 'value' vs. 'number' difference or combine the terms

- change the return value of run() in strategies from object to just operationLog?

- implement notes within blocks, look for note pairs and have some kind of "resolve notes" strategy?
- Include notes in operations log
- clear notes on row, col and block when that number is set as a value in a cell
- change other strategies to "let wasOpLogGeneratedDuringPass = true"
- refactor setLinearGuessBlockValues to return operrationlogs and add operationlog when notes are found
- refactor linearGuessStrategy and resolveNotesStrategy to share the same code for clearing notes and finding rows / cols to force linear guess values
- add note logic to utils.canCellContainNumber

