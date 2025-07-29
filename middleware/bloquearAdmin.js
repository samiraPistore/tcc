module.exports = function bloquearAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return res.status(403).json({ error: 'Admins não podem acessar essa rota.' })
  }
  next()
}
