import type { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import nc from 'next-connect';

import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { politicaCORS } from '@/middlewares/politicaCORS';

import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';

const handler = nc()
  .put(async (
    req: NextApiRequest,
    res: NextApiResponse<StandardResponse>
  ) => {
    try {
      const {userId, id} = req.query;

      const usuarioLogado = await UserModel.findById(userId);
      if (!usuarioLogado){
        return res.status(400).json({ error: 'Usuário não encontrado' })
      }

      const publicacao = await PublicacaoModel.findById(id)
      if (!publicacao){
        return res.status(400).json({ error: 'Publicacao não encontrado' })
      }

      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({ error: 'Comentário não informado ou não é valido' })
      }

      const comentario = {
        userId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario
      }

      publicacao.comentarios.push(comentario)

      await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)

      return res.status(200).json({msg: 'Comentário inculído com sucesso'})
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao adcionar um comentário' })
    }
  })

  export default politicaCORS(validateJWTtoken(mongodbConnection(handler)));