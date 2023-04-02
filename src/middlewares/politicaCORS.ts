import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { StandardResponse } from '@/types/StandardResponse';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler: NextApiHandler) =>  async(
  req: NextApiRequest, 
  res: NextApiResponse<StandardResponse>
) => {
  try {
    await NextCors(req, res, {
      origin: '*',
     methods: ['GET', 'POST', 'PUT'],
     optionsSuccessStatus: 200
    });

    return handler(req, res);
  } catch (error) {
    console.log('Erro ao tratar a politica de CORS: ', error);
    res.status(500).json({error: 'Ocorreu erro ao tratar a politica de CORS'})
  }
}
  

