TODO List

- Establish 'value' vs. 'number' difference or combine the terms
- Include notes in operations log
- refactor setLinearGuessBlockValues to return operrationlogs and add operationlog when notes are found
- refactor linearGuessStrategy and resolveNotesStrategy to share the same code for clearing notes and finding rows / cols to force linear guess values
- add note logic to utils.canCellContainNumber
- find a way to better represent the text game input so the games can be inserted directly into the tests
- implement adding note pairs when the rest of the row or col outside of the block is prevented from being that value due to numbers or notes (expert game 2 top row right-most two cells should have notes for 7)