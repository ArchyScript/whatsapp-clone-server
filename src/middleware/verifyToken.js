// const expressAsyncHandler = require('express-async-handler');
// const jwt = require('jsonwebtoken')

// const verifyToken = expressAsyncHandler(async (req, res, next) => {
//   let token
//   let authHeader = req.headers.Authorization || req.headers.authorization
//   if (authHeader && authHeader.startsWith('Bearer')) {
//     token = authHeader.split(" ")[1]
//     console.log("token", token)
//     await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         res.status(401)
//         console.log('err:::', err)
//         throw new Error('Not authorized')
//       } else {
//         req.user = decoded
//         console.log("decoded:::", decoded)
//         next()
//       }
//     }) }
// })

// module.exports = verifyToken