import type { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import type { LoginResponse } from '@/types/LoginResponse';

import md5 from 'md5';
import jwt from 'jsonwebtoken';

import { politicaCORS } from '@/middlewares/politicaCORS';
import { mongodbConnection } from '@/middlewares/mongodbConnection';

import { UserModel } from '@/models/UserModel';

const loginEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse | LoginResponse>
) => {

  const { JWT_SECRET_KEY } = process.env;
  if (!JWT_SECRET_KEY) {
    return res.status(500).json({ error: 'Env JWT_KEY não informado' })
  }

  if (req.method === 'POST') {
    const { email, senha } = req.body;

    const userExists = await UserModel.findOne({ email, senha: md5(senha) })
    if (!userExists) {
      return res.status(405).json({ error: 'Usuário ou senha não encontrados' })
    }
    const token = jwt.sign({_id: userExists._id} , JWT_SECRET_KEY)
    return res.status(200).json({
      nome: userExists.nome, 
      email: userExists.email, 
      token 
    })
  }
  return res.status(405).json({ error: 'Metodo Informado não é válido' })
}

export default politicaCORS(mongodbConnection(loginEndPoint));

