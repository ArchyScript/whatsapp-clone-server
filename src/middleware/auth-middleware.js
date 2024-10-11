const jwt = require('jsonwebtoken')


const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt
    console.log('cookies:::', req.cookies)
    if (!token) return res.status(401).send('Not Authenticated')

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) return res.status(403).send('Invalid Token')

        // add user id gotten from the token to the request that can be accessed by the next middleware or controller
        req.userId = payload.userId
        next()
    })
    // let authHeader = req.headers.Authorization || req.headers.authorization
    // if (authHeader && authHeader.startsWith('Bearer')) {
    //     token = authHeader.split(" ")[1]
    //     console.log("token", token)
    //     await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    //         if (err) {
    //             res.status(401)
    //             console.log('err:::', err)
    //             throw new Error('Not authorized')
    //         } else {
    //             req.user = decoded
    //             console.log("decoded:::", decoded)
    //             next()
    //         }
    //     })
    // }
}


module.exports = verifyToken