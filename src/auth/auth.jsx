// import jwt from 'jsonwebtoken';

// export const autenticarToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']; // "Bearer token"
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ msg: 'Token não fornecido' });

//   jwt.verify(token, process.env.JWT_SECRET || 'minhaChaveSuperSecreta', (err, user) => {
//     if (err) return res.status(403).json({ msg: 'Token inválido' });

//     req.user = user; // { id, email, cargo, iat, exp }
//     next();
//   });
// };
