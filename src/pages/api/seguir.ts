import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { StandardResponse } from '@/types/StandardResponse';
import { UserModel } from '@/models/UserModel';
import { SeguidorModel } from '@/models/SeguidorModel';


const handler = nc()
  .put(async (
    req: NextApiRequest,
    res: NextApiResponse<StandardResponse>
  ) => {
    try {
      const { userId, id } = req?.query;
      const usuarioLogado = await UserModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ error: 'Usuario Logado não encontrado' })
      }

      const usuarioASerSeguido = await UserModel.findById(id);
      if (!usuarioASerSeguido) {
        return res.status(400).json({ error: 'Usuario a ser seguido não encontrado' })
      }

      const euJaSigo = await SeguidorModel
        .find({ usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id });

      if (euJaSigo && euJaSigo.length > 0) {
        euJaSigo.forEach(async(e: any) => 
        await SeguidorModel.findByIdAndDelete({_id: e._id}) )

        usuarioLogado.seguindo--;
        await UserModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
        usuarioASerSeguido.seguidores--;
        await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

        return res.status(200).json({ msg: 'Deixou de seguir o usuário com sucesso' })
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioASerSeguido._id
        }
        await SeguidorModel.create(seguidor);
        usuarioLogado.seguindo++;
        await UserModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
        usuarioASerSeguido.seguidores++;
        await UserModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)
        return res.status(200).json({ msg: 'usuário seguido com sucesso' })
      }


    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao seguir/desseguir o usuário informado' })
    }

  })

export default validateJWTtoken(mongodbConnection(handler));