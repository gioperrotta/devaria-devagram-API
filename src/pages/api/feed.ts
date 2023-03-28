import { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';

const feedEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse | any>
) => {
  try {
    if (!(req.method === 'GET')) {
      return res.status(405).json({ error: 'Method informado não é valído' })
    }
    if (req?.query?.id) {
      const { id } = req.query;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(400).json({ error: 'usuário não encontrado' })
      }
      const publicacoes = await PublicacaoModel
        .find({ userId: user._id })
        .sort({data: -1})
      
      return res.status(200).json(publicacoes)
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'Não foi possível obter o feed' })
  }
}

export default validateJWTtoken(mongodbConnection(feedEndPoint));