# TIC TAC TOE - REACT WITH FASTIFY
Build a functional tic-tac-toe. It is a traditional game where players have to place three marks of the same color in a row.

##  API BACKEND
- **Technologies**: (Node.js with Fastify)
- **POST** web service listening to requests on /api/tic-tac-toe/play that matches following specification

### Request body
Public web service accept body param with a structure similar to this one:
```json
{
  "matchId": "5a5c6f9b4d749d008e07e695", //string, identifies the current match, required
  "boardState": [
    "x", "-", "-", // first row of the game board, positions 0, 1, 2
    "-", "o", "o", // second row of the game board, positions 3, 4, 5
    "-", "-", "x" // third row of the game board, positions 6, 7, 8
  ], // array of chars ( one of ['o','x','-']), required
  "nextMove": {
    "char": "o", // char one of ['o','x'], required
    "position": 4 // number from 0 to 8, required 
  }, // object, represents the next move of the player, required only on input
  "history": [
    {
      "char": "x",
      "position": 0
    }
  ],
  "pUser": [
    {
      "charUser": "x",
      "winner": ""
    }
  ], 
  "initialId": "5a5c6f9b4d749d008e07e695"
}
```
### Response body
Server return the same structure than request but updated with the move provided by user and another move done by a bot. 

### Game initialisation
Any request without payload will start a new match. When starting a new match the server can play first or not randomly.

If machine plays first, mark type (x or y) will be assigned randomly.

If move is valid, server has to calculate new board state adding both human and bot move.


### Request validation
Server verify the next rules and return a error messages:
- Request payload is a valid JSON. <span style="color:red">**Error**: *Not valid payload format*</span>
- Provided nextMove is valid. <span style="color:red">**Error**: *Not valid move*</span>
- Provided matchId was not modified. <span style="color:red">**Error**: *Not valid matchId*</span>
- Match did not finish. <span style="color:red">**Error**: *Match has finished*</span>

## REACT FRONTEND
This part was made with React and it allow user to play a complete match versus the CPU using the API BACKEND and clicking on the board.

- The server detect not valid ids
- The server detect not valid payloads
- The CPU player play correctly
- The server maintains the complete list of past moves on the history
- The UI dont't allow wrong moves
- The UI allows to play a complete match without noticeable problems
- Clean and readable code
- The server detect not valid moves correctly
- Functional oriented code [no stateful objects are being defined]
- The server is able to maintain a valid flow of successive boardStates without using any kind of storage [db, file, memory]
