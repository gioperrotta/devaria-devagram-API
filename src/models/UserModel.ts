import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  avatar: { type: String, required: false },
  seguidores: { type: Number, default: 0 },
  seguindo: { type: Number, default: 0 },
  publicacoes: { type: Number, default: 0 }
});

export const UserModel = (
  mongoose.models.users ||
  mongoose.model('users', UserSchema)
);