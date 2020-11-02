/**
 * @fileoverview Api routes
 * @version  1
 * @author Oscar Bello <hola@oscarbello.es>
 * @copyright oscarbello
 *
 * History
 * v1 - Api routes
*/

const myFunction = require('../controllers/tttController')

async function routes(fastify, options, done) {

/**
 * @descriptor POST route to play game
 */
    fastify.post('/api/tic-tac-toe/play', async (request, reply) => {

        const jsonBody = JSON.parse(request.body)

        if (!jsonBody.matchId) {//START game
            const newGame = myFunction.startGame()
            return newGame
        }

        else {
            const checkID = myFunction.validMatchID(jsonBody)//Check matchId
            const vPayload = myFunction.validPayload(jsonBody)//Check payload

            if (checkID === true && vPayload === true) {//If matchId and payload is correct, we play again
                const bodyReturn = myFunction.playAgain(jsonBody)

                return bodyReturn 
            }
            else if (checkID !== true) {//MatchId not valid

                return (checkID)
            }
            else if (vPayload !== true) {//Payload not valid
                return (vPayload)
            }
        }
    })

    done()
}

module.exports = routes