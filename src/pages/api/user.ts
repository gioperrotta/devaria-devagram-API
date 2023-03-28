import { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { UserModel } from '@/models/UserModel';

const usuarioEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse | any>
) => {
  try {
    const { userId } = req?.query;
    const user = await UserModel.findById(userId);
    user.senha = null;
    return res.status(200).json(user)    
  } catch (error) {
    console.log(error)
    return res.status(400).json({error:'Não foi possível obter os dados do usuário'})
  }  
}

export default validateJWTtoken(mongodbConnection(usuarioEndPoint));