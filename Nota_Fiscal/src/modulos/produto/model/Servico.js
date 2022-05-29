import mongoose from 'mongoose';
import { required } from 'nodemon/lib/config';

const Schema = mongoose.Schema;  
const model = mongoose.model;

const ServicoSchema = new Schema({
  datanf1: String,
  numnf1: String,
  numemp1: String, 
  numpedido1: String,
  numcontrato1: String,
  datareceb1:  String,
  secretaria: String,
  fornecedorRazaoSocial: String,
  fornecedorCnpj: String,
  gestor: String,
  pedidocompra1: String,
  valorVenda1: Number,
  arquivonf: {type: [String]},
  arquivolaudo: {type: [String]},
  situacao: String,
  aprovacao: String,
  //
  operador1: String,  
  //
  dtmodificacao1: {type: Date, default: Date.now},  
  //
  observation1: String,
  //
  usuarioId: String,
});

module.exports = model('Servico', ServicoSchema);
