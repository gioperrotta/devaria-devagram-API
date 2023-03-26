import type { NextApiRequest, NextApiResponse } from 'next';
import { mongodbConnection } from '@/middlewares/MongodbConnection';
import { StandardResponse } from '@/types/StandardResponse';


const loginRoute = (req: NextApiRequest, res: NextApiResponse<StandardResponse>) => {
  if (req.method === 'POST') {
    const { login, senha } = req.body

    if (login === 'admin@admin.com' && senha === '123') {
      return res.status(200).json({ msg: 'Usuário autenticado com sucesso' })
    } return res.status(405).json({ error: 'Usuário ou senha não encontrados' })

  }
  return res.status(405).json({ error: 'Metodo Informado não é válido' })
}

export default mongodbConnection(loginRoute)