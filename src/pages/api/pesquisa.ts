import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';

import type { StandardResponse } from '@/types/StandardResponse';
import { UserModel } from '@/models/UserModel';


const handler = nc()
  .get(async (
    req: NextApiRequest,
    res: NextApiResponse<StandardResponse | any>
  ) => {
    try {
      if (req?.query?.id) {
        const userId = req?.query?.id;
        const usuarioEncontrado = await UserModel.findById(userId);
        if (!usuarioEncontrado) {
          return res.status(400).json({ erro: 'Usuário não encontrado!' })
        }
        usuarioEncontrado.senha = null;
        return res.status(200).json(usuarioEncontrado)
      } else {
        const { filtro } = req.query;
        if (!filtro || filtro.length < 2) {
          return res.status(400).json({ erro: 'Favor informar um filtro para pesquisa' })
        }

        const usuariosEncontrados = await UserModel.find({
          $or: [
            { nome: { $regex: filtro, $options: 'i' } },
            // {email: {$regex: filtro, $options: 'i'}},
          ]
        })
        return res.status(200).json(usuariosEncontrados)
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Não foi possível buscar usuários' })
    }

  })

export default validateJWTtoken(mongodbConnection(handler));