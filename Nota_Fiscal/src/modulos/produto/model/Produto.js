import mongoose from 'mongoose';
import { required } from 'nodemon/lib/config';

const Schema = mongoose.Schema;
const model = mongoose.model;

const ProdutoSchema = new Schema({
  datanf: String,
  numnf: String,
  numemp: String,
  numpedido: String,
  numcontrato: String,
  datareceb:  String,
  secretaria: String,
  fornecedorRazaoSocial: String,
  fornecedorCnpj: String,
  gestor: String,
  pedidocompra: String,
  valorVenda: Number,
  arquivo: {type: [String]},
  arquivo1: {type: [String]},
  situacao: String,
  aprovacao: String,
  //
  operador: String,  
  //
  //
  dtmodificacao: {type: Date, default: Date.now},  
  //
  observation: String,
  //
  usuarioId: String,
});

module.exports = model('Produto', ProdutoSchema);
