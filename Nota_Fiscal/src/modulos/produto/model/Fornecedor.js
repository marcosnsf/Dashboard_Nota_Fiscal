import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const FornecedorSchema = new Schema({
  razaoSocial: String,
  cnpj: String,
  // 
  ncontrato: String,
  vigencia: String,
  gestorcontrato: String,
  empenho: String,
  // 
  usuarioId: String,
});

module.exports = model('Fornecedor', FornecedorSchema);
//module.exports = model('Fornecedor1', FornecedorSchema);
