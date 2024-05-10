const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "unAuthorized" })
  }
  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    process.env.Access_Token_Secret,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })
      req.Email = decoded.userInfo.Email
      req.Password = decoded.userInfo.Password
      next();
    }
  )
}

module.exports = verifyJWT
