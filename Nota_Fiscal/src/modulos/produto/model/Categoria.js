import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const CategoriaSchema = new Schema({
  secretaria: String,
  gestor: String,
  departamento: String,
  usuarioId: String,
});

module.exports = model('Categoria', CategoriaSchema);
//module.exports = model('Categoria1', CategoriaSchema);
