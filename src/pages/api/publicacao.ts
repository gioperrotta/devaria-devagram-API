import type { NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '@/services/uploadImageCosmic';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { validateJWTtoken } from '@/middlewares/validateJWTtoken';
import { UserModel } from '@/models/UserModel';
import { PublicacaoModel } from '@/models/PublicacaoModel';

const handler = nc()
  .use(upload.single('file'))
  .post(async (
    req: NextApiRequest | any,
    res: NextApiResponse<StandardResponse>
  ) => {
    try {
      const { userId } = req.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(400).json({ error: 'Usuario não encontrado' })
      }

      if (!req || !req.body) {
        res.status(400).json({ error: 'Parametros de entrada não informados' })
      }
      const { descricao } = req.body;
      if (!descricao || descricao.length < 2) {
        res.status(400).json({ error: 'Descrição não é válida' })
      }

      if (!req.file || !req.file.originalname) {
        res.status(400).json({ error: 'Imagem é obrigatória' })
      }

      const image = await uploadImageCosmic(req);
      const publicacao = {
        userId: user._id,
        descricao,
        foto: image.media.url,
        data: new Date()
      }
      await PublicacaoModel.create(publicacao);
      return res.status(200).json({ msg: 'publicação criada com sucesso' })

    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: 'Erro ao cadastrar publicação' })
    }
  });

export const config = {
  api: {
    bodyParser: false
  }
}

export default validateJWTtoken(mongodbConnection(handler))


