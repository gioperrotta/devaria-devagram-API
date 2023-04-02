import type { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';

import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { politicaCORS } from '@/middlewares/politicaCORS';

import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { SeguidorModel } from '@/models/SeguidorModel';

const feedEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse | any>
) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        const { id } = req.query;
        const user = await UserModel.findById(id);
        if (!user) {
          return res.status(400).json({ error: 'usuário não encontrado' })
        }
        const publicacoes = await PublicacaoModel
          .find({ userId: user._id })
          .sort({ data: -1 })

        return res.status(200).json(publicacoes)
      } else {
        const { userId } = req.query;
        const usuariioLogado = await UserModel.findById(userId);
        if (!usuariioLogado) {
          return res.status(400).json({ error: 'Usuário não encontrado' })
        }
        const seguidores = await SeguidorModel.find({ usuarioId: usuariioLogado._id });
        const seguidoresIds = seguidores.map(seguidor => seguidor.usuarioSeguidoId)


        const publicacoes = await PublicacaoModel
          .find({
            $or: [
              { userId: usuariioLogado._id },
              { userId: seguidoresIds }
            ]
          })
          .sort({ data: -1 });

        const result = [];
        for (const publicacao of publicacoes) {
          const usuarioDaPublicacao = await UserModel.findById(publicacao.userId);
          if (usuarioDaPublicacao) {
            const final = {
              ...publicacao._doc, user: {
                nome: usuarioDaPublicacao.nome,
                avatar: usuarioDaPublicacao.avatar
              }
            };
            result.push(final)
          }
        }
        return res.status(200).json(result);
      }
    }
    return res.status(405).json({ error: 'Method informado não é valído' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'Não foi possível obter o feed' })
  }
}

export default politicaCORS(validateJWTtoken(mongodbConnection(feedEndPoint)));