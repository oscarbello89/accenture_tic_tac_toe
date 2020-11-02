/**
 * @fileoverview Api play controller
 * @version  1
 * @author Oscar Bello <hola@oscarbello.es>
 * @copyright oscarbello
 *
 * History
 * v1 - Whole functions
*/


//Variables and constants
const payloadCheck = require('payload-validator')
const { nextMove } = require('../models/payloadModel')
let bMark
let position
let gBoardGame
let history
let err = ""
let uMark
let userWin
let uParam
let bodyReturn




/**
 * @descriptor Start a new game
 */
function startGame() {
    
    const newMID = newMatchID(25)
    const wStart = whoStart()
    userWin=""
    

    switch (wStart) {
        case "CPU": //Start backend
            bMark = whichMark()
            position = Math.floor(Math.random() * 8)
            gBoardGame = generateBoardGame(position, bMark, null)
            history = [{ char: bMark, position: position }]
            uMark = whichMark(bMark)
            uParam = [{ charUser: uMark, winner: userWin }]
            

            bodyReturn = generateBody(newMID, gBoardGame, null, history, err, uParam, newMID)
            //bodyReturn = [bodyReturn.body]
            
            return (bodyReturn)

        case "USER": //Start user
            uMark = whichMark() 
            uParam = [{ charUser: uMark, winner: userWin }]
            //position = Math.floor(Math.random() * 8)
            gBoardGame = generateBoardGame(null, null, null)
            bodyReturn = generateBody(newMID, gBoardGame, null, null, err, uParam, newMID)
            //bodyReturn = [bodyReturn.body]
            
            return (bodyReturn)
    }
    
}


/**
 * @param {json} jsonBody 
 * @descriptor Play after create game
 */
function playAgain(jsonBody) {

    //Check valid move
    const validMove = isValidMove(jsonBody.nextMove, jsonBody.boardState)
    if (validMove === true) {
        
        //Add valid move to the board game
        gBoardGame = generateBoardGame(jsonBody.nextMove.position, jsonBody.nextMove.char, jsonBody.boardState)
        
        //Add valid move to history
        history = addToHistory(jsonBody.history, jsonBody.nextMove)

        //Check if someone won
        userWin = checkWinner(gBoardGame)
        
        if (!userWin) {//If anyone won, backend play again
            //Generate backend move and add to the board game
            const posFree = searchOneFreePosition(gBoardGame)
            uMark = jsonBody.pUser[0].charUser
            bMark = whichMark(uMark)
            gBoardGame = generateBoardGame(posFree, bMark, gBoardGame)

            //Add backend move to history
            const moveBackend = { char: bMark, position: posFree }
            history = addToHistory(jsonBody.history, moveBackend)

            //Check if someone won again
            userWin = checkWinner(gBoardGame)
            if (userWin) uParam = [{ charUser: uMark, winner: userWin }]
            
            bodyReturn = generateBody(jsonBody.matchId, gBoardGame, null, history, jsonBody.err, uParam, jsonBody.initialId)
        } 
        else {
            uParam = [{ charUser: uMark, winner: userWin }]
            bodyReturn = generateBody(jsonBody.matchId, gBoardGame, null, history, jsonBody.err, uParam, jsonBody.initialId)
        }
    }
    else {
        bodyReturn = generateBody(jsonBody.matchId, jsonBody.boardState, null, jsonBody.history, jsonBody.err, jsonBody.pUser, jsonBody.initialId)
    }
    return (bodyReturn)
}

/**
 * @descriptor Return who start the game
 */
function whoStart() { 
        const players = ['CPU', 'USER']
        const who = players[Math.floor(Math.random() * players.length)]

        return (who)
    }
      

/**
 * @param {string} m 
 * @descriptor Returns one mark to play
 */
function whichMark(m) {
    const marks = ['x', 'o']
    let theMark = ""

    if (m) {
        const index = marks.indexOf(m)
        if (index > -1) marks.splice(index, 1)

        theMark = marks[Math.floor(Math.random() * marks.length)]
    } else theMark = marks[Math.floor(Math.random() * marks.length)]

    return (theMark)
    
    }

/**
 * @param {string} gMatchId 
 * @param {array} gBoardState 
 * @param {array} gNextMove 
 * @param {array} gHistory 
 * @param {array} gError 
 * @param {array} gPUser 
 * @param {string} gInitialId 
 * @descriptor It constructs the body of the api answer
 */
function generateBody(gMatchId, gBoardState, gNextMove, gHistory, gError, gPUser, gInitialId) {
    let bodyGenerate = {}
    if (gMatchId) bodyGenerate["matchId"] = gMatchId
    if (gBoardState) bodyGenerate["boardState"] = gBoardState
    if (gNextMove) bodyGenerate["nextMove"] = gNextMove
    if (gHistory) bodyGenerate["history"] = gHistory
    if (gError) bodyGenerate["error"] = gError
    if (gPUser) bodyGenerate["pUser"] = gPUser
    if (gInitialId) bodyGenerate["initialId"] = gInitialId

    return [bodyGenerate]
}

/**
 * @param {integer} pos 
 * @param {string} mark 
 * @param {array} bBoardGame 
 * @descriptor It constructs the board game with the marks
 */
function generateBoardGame(pos, mark, bBoardGame) {
    let boardGame = []

    //Position and mark are null when user start game
    if (!pos && !mark) {
        for (let i = 0; i < 9; i++){
            boardGame[i] = "-"
        }
    }

    //Backend start game
    if (!bBoardGame && pos && mark) {
        for (let i = 0; i < 9; i++) {
            if (i == pos) {
                boardGame[i] = mark
            }
            else boardGame[i] = "-"
        }
    }

    

    //Update boardGame
    if (bBoardGame) {
        boardGame = bBoardGame 
        boardGame[pos] = mark
        
    }

    return boardGame
}


/**
 * @param {integer} length 
 * @descriptor Return a match ID
 */
function newMatchID(length) {

    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
}




//REQUEST VALIDATION FUNCTIONS
/**
 * @param {json} body 
 * @descriptor Check if the request payload is a valid JSON
 */
function validPayload(body) {
    let result = payloadCheck.validator(body, payloadCheck, [0], true)

    if (result.success == true) {
        return result.success
    } else {
        return {
            "error": true,
            "message": "Not valid payload format"
        }
    }
    
}

/**
 * @param {array} move 
 * @param {array} board 
 * @descriptor Check if provided nextMove is valid
 */
function isValidMove(move, board) {
    
    return board[move.position] === "-"
}

/**
 * @param {json} body 
 * @descriptor Check if provided matchId was not modified
 */
function validMatchID(body) {
    if (body.matchId == body.initialId) {
        return true
    }
    else return {
        "error": true,
        "message": "Not valid matchId"
    }

    
}

/**
 * @param {array} boardGame 
 * @descriptor Search free positions on the board
 */
function searchOneFreePosition(boardGame) {
    let freePositions = []
    let fp = boardGame.indexOf("-")

    while (fp != -1) {
        freePositions.push(fp)
        fp = boardGame.indexOf("-", fp + 1)
    }
    
    const pF = freePositions[Math.floor(Math.random() * freePositions.length)]

    return pF
}


/**
 * @param {array} h 
 * @param {array} nMove
 * @descriptor Add moves to history
 */
function addToHistory(h, nMove) {
    h.push(nMove)
    return h
}

/**
 * @param {array} mBoard 
 * @param {array} nMove
 * @descriptor Check if someone won the game
 */
function checkWinner(mBoard) {
        let winPos = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6],]
        let theBoard = mBoard

        for (let i = 0; i < winPos.length; i++){
            if (theBoard[winPos[i][0]] === theBoard[winPos[i][1]] && theBoard[winPos[i][1]] === theBoard[winPos[i][2]]) {
               
                if (theBoard[winPos[i][0]] !== "-") {
                    return theBoard[winPos[i][0]]
                } 

            }
    }
    
    }

module.exports = {startGame, validPayload, validMatchID, playAgain, checkWinner}



