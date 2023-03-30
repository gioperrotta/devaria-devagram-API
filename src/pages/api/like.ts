import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';

import type { StandardResponse } from '@/types/StandardResponse';
import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';


const handler = nc()
  .put(async (
    req: NextApiRequest,
    res: NextApiResponse<StandardResponse>
  ) => {
    try {
      const { id } = req?.query;
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ error: 'Publicação não encontrada' })
      }
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      const indexDoUserNoLike = publicacao.likes
        .findIndex((e: string) => e.toString() === user._id.toString());
      if (indexDoUserNoLike >= 0 ) {
        publicacao.likes.splice(indexDoUserNoLike, 1);
        await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
        return res.status(200).json({ error: 'Publicação descurtida com sucesso' });
      }else {
        publicacao.likes.push(user._id);
        await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
        return res.status(200).json({ msg: 'Publicação ccurtida com sucesso' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao curtir/descurtir uma publicação' })
    }
  })

export default validateJWTtoken(mongodbConnection(handler));