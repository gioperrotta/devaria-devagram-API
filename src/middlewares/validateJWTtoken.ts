import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { StandardResponse } from '@/types/StandardResponse';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validateJWTtoken = (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<StandardResponse>) => {
    try {

      const { JWT_SECRET_KEY } = process.env;
      if (!JWT_SECRET_KEY) {
        return res.status(500).json({ error: 'Env JWT_KEY não informado' })
      }

      if (!req || !req.headers) {
        return res.status(401).json({ error: 'Não foi possivel validar o token de acesso' })
      }

      if (req.method !== 'OPTIONS') {
        const { authorization } = req.headers;
        if (!authorization) {
          return res.status(401).json({ error: 'Não foi possivel validar o token de acesso' })
        }
        const token = authorization.substring(7)
        if (!token) {
          return res.status(401).json({ error: 'Não foi possivel validar o token de acesso' })
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
        if (!decoded) {
          return res.status(401).json({ error: 'Não foi possivel validar o token de acesso' })
        }
        if (!req.query) {
          req.query = {}
        }
        req.query.userId = decoded._id;
      }
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'Não foi possivel validar o token de acesso' })
    }

    return handler(req, res);
  }