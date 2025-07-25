// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(401).json({ msg: 'Token não enviado' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ msg: 'Token inválido' });

//   try {
//     const secret = process.env.JWT_SECRET || 'minhaChaveSuperSecreta';
//     const payload = jwt.verify(token, secret);

//     if (payload.cargo === 'gerente') {
//       return res.status(403).json({ msg: 'Acesso negado para gerentes' });
//     }

//     req.user = payload;
//     next();
//   } catch (error) {
//     return res.status(401).json({ msg: 'Token inválido ou expirado' });
//   }
// };
