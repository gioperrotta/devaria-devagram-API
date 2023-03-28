import mongoose, { Schema } from 'mongoose';

const PublicacaoSchema = new Schema({
  userId: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: { type: String, required: true },
  data: { type: Date, required: true, default: Date.now() },
  comentarios: { type: Array, rerquired: true, default: [] },
  likes: { type: Array, rerquired: true, default: [] },
})

export const PublicacaoModel = (
  mongoose.models.publicacoes ||
  mongoose.model('publicacoes', PublicacaoSchema)
)


