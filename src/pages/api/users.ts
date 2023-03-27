import { NextApiRequest, NextApiResponse } from "next";
import { StandardResponse } from '@/types/StandardResponse';
import { UserRequest } from "@/types/UserRequest";
import { mongodbConnection } from "@/middlewares/mongodbConnection";
import { UserModel } from "@/models/UserModel";
import md5 from 'md5';

const usersEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<StandardResponse>
) => {
  if (req.method === 'POST') {
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
    const userExists = UserModel.find({email: user.email})
    if (!!userExists) {
      return res.status(400).json({ error: 'Já existe uma conta com este e-mail' });
    }
    const userToCreate = {
      nome: user.nome,
      email: user.email,
      senha: md5(user.senha)
    }
    await UserModel.create(userToCreate);
    return res.status(200).json({ error: 'Usuário cadstrado com sucesso' });
  }
  
  return res.status(405).json({ error: 'Metodo Informado não é válido' });
}

export default mongodbConnection(usersEndPoint);