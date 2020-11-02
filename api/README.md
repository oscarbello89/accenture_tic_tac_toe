##  API BACKEND Tic Tac Toe
- **Technologies**: (Node.js with Fastify)
- **POST** web service listening to requests on /api/tic-tac-toe/play that matches following specification

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


```flow

st=>start: Api POST
op=>operation: Check request
cond=>condition: Is it OK?
e=>end: Return board state
error=>error: Show errors

st->op->cond
cond(yes)->e
```