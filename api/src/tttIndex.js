/**
 * @fileoverview Api index
 * @version  1
 * @author Oscar Bello <hola@oscarbello.es>
 * @copyright oscarbello
 *
 * History
 * v1 - Api index
*/

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-cors'), {
  "origin": '*',
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 201
})



fastify.register(require('./routes/routes'))



fastify.listen(5000, (err, address)=> {
    if(err){
        console.error(err)
        process.exit(1)
    }

    console.log(`Server running on ${address}`)

})