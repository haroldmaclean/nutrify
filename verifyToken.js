const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  if (req.headers.authorization !== undefined) {
    let token = req.headers.authorization.split(' ')[1]
    // ✅ FIX: Use the environment variable for verification
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (!err) {
        next()
      } else {
        res.status(403).send({ message: 'Invalid token' })
      }
    })
  } else {
    res.status(401).send({ message: 'Please send a token' }) // Changed to 401 for better security practice
  }
}

module.exports = verifyToken
