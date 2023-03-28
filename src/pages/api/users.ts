import { NextApiRequest, NextApiResponse } from "next";
import { StandardResponse } from '@/types/StandardResponse';
import { UserRequest } from '@/types/UserRequest';
import { mongodbConnection } from '@/middlewares/mongodbConnection';
import { UserModel } from '@/models/UserModel';
import md5 from 'md5';
import { upload, uploadImageCosmic } from '@/services/uploadImageCosmic';
import nc from 'next-connect';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse<StandardResponse>) => {

    const user = req.body as UserRequest;

    if (!user.nome || user.nome.length < 2) {
      return res.status(400).json({ error: 'Nome do usuário inválido' });
    }
    if (!user.email ||
      user.email.length < 5 ||
      !user.email.includes('@') ||
      !user.email.includes('.')
    ) {
      return res.status(400).json({ error: 'E-mail do usuário inválido' });
    }
    if (!user.senha || user.senha.length < 4) {
      return res.status(400).json({ error: 'Senah inválida' });
    }

     const userExists = await UserModel.findOne({ email: user.email })
     if (!!userExists) {
      return res.status(400).json({ error: 'Já existe uma conta com este e-mail' });
     }
    // enviar a imagem do multer para o cosmic
    const image = await uploadImageCosmic(req)

    const userToCreate = {
      nome: user.nome,
      email: user.email,
      senha: md5(user.senha),
      avatar: image?.media.url
    }
    await UserModel.create(userToCreate);
    return res.status(200).json({ error: 'Usuário cadstrado com sucesso' });
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default mongodbConnection(handler);