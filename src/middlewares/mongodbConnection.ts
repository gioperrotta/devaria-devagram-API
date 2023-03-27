import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { StandardResponse } from '@/types/StandardResponse';

export const mongodbConnection = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<StandardResponse>) => {

    if (mongoose.connections[0].readyState) { // banco já conectado
      mongoose.connection.on('connected', () => console.log('Databese connected'));
      return handler(req, res)
    }

    const { DB_CONNECTION_STRING } = process.env
    if (!DB_CONNECTION_STRING) {
      return res.status(500).json({ error: 'ENV de config do BD, não informado' });
    }
    
    mongoose.connection.on('connected', () => console.log('Databese connected'));
    mongoose.connection.on('error', error => console.log(`Database connection error : ${error}`));
    await mongoose.connect(DB_CONNECTION_STRING);

    return handler(req, res);
  }



