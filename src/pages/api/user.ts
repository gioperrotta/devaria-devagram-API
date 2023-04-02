import type { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import nc from 'next-connect';

import { politicaCORS } from '@/middlewares/politicaCORS';
import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { mongodbConnection } from '@/middlewares/mongodbConnection';

import { UserModel } from '@/models/UserModel';
import { upload, uploadImageCosmic } from '@/services/uploadImageCosmic';

const handler = nc()
  .use(upload.single('file'))
  .put(async (
    req: NextApiRequest | any,
    res: NextApiResponse<StandardResponse>
  ) => {
    try {
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontardo' });
      }
      const { nome } = req.body;
      if (nome && nome.length > 2) {
        user.nome = nome
      }
      if (req.file && req.file.originalname) {
        const image = await uploadImageCosmic(req);
        if (image && image.media && image.media.url) {
          user.avatar = image.media.url;
        }
      }

      await UserModel
        .findByIdAndUpdate({ _id: user._id }, user)

      return res.status(200).json({ msg: 'Usuário alterado com sucesso' })


    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: 'Não foi possível obter os dados do usuário' })
    }
  })
  .get(async (
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
      return res.status(400).json({ error: 'Não foi possível obter os dados do usuário' })
    }
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCORS(validateJWTtoken(mongodbConnection(handler)));