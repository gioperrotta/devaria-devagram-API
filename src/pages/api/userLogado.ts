import { NextApiRequest, NextApiResponse } from "next";
import { validateJWTtoken } from "@/middlewares/validateJWTtoken";

const usuarioEndPoint = (req:NextApiRequest, res:NextApiResponse) => {
  return res.status(200).json('Usuario autenticado com sucesso')
}

export default validateJWTtoken(usuarioEndPoint);