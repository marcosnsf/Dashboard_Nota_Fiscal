import Categoria from '../model/Categoria';

class CategoriaController {
  async iniciarFormularioCategoria(req, res) {
    res.render('categorias/cadastrar');
  }

  async buscarCategorias(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ secretaria: { $exists: true }, departamento: { $exists: true },gestor: { $exists: true }, usuarioId });
    const categoriasResponse = [];
    categorias.map((categoria) => {
      categoriasResponse.push({
        id: categoria._id,
        secretaria: categoria.secretaria,
        departamento: categoria.departamento,
        gestor: categoria.gestor,
        usuarioId,
      });
    });
    res.render('categorias/listar', {
      categorias: categoriasResponse,
    });
  }

  async buscarTodasCategorias(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ usuarioId });
    return res.json(categorias);
  }

  async buscarCategoria(req, res) {
    const { id } = req.params;
    const { authUser } = req;
    const usuarioId = authUser.id;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const categoria = await Categoria.findOne({ _id: id, usuarioId });
    if (!categoria) {
      return res.status(400).json({ message: 'A categoria não foi encontrada.' });
    }
    return res.json(categoria);
  }

  async salvarCategoria(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { secretaria, departamento, gestor } = req.body;
    const categoria = await Categoria.findOne({ secretaria,departamento, gestor, usuarioId });
    if (!secretaria || !departamento|| !gestor) {
      return res.status(400).json({ message: 'É obrigatório preencher todos os campos.' });
    }
    // if (categoria) {
    //   return res.status(400).json({ message: 'Esta categoria já está cadastrada.' });
    // }
    try {
      const novaCategoria = await Categoria.create({ secretaria, departamento, gestor, usuarioId });
      return res.json(novaCategoria);
    } catch (error) {
      return res.status(400).json({ message: 'Houve um erro ao salvar a categoria.' });
    }
  }

  async editarCategoria(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    const { secretaria } = req.body;
    const { departamento } = req.body;
    const { gestor } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    if (!secretaria) {
      return res.status(400).json({ message: 'A Secretaria é obrigatória.' });
    }
    const categoriaDescricao = await Categoria.findOne({ secretaria, usuarioId });
    const categoria = await Categoria.findById(id);
    if (
      categoriaDescricao &&
      secretaria === categoriaDescricao.secretaria &&
      String(id) !== String(categoriaDescricao._id)
    ) {
      return res.status(400).json({ message: 'Esta categoria já está cadastrada.' });
    }
    categoria.secretaria = secretaria;
    categoria.departamento = departamento;
    categoria.gestor = gestor;
    try {
      await categoria.save();
      return res.json('A categoria foi atualizada com sucesso!');
    } catch (error) {
      return res.status(400).json({ message: 'Houve um erro ao editar a categoria.' });
    }
  }

  async removerCategoria(req, res) {
    const { id } = req.params;
    const { authUser } = req;
    const usuarioId = authUser.id;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      const categoriaExistente = await Categoria.findOne({ _id: id, usuarioId });
      if (!categoriaExistente) {
        return res.status(400).json('Você não tem permissão para remover esta categoria.');
      }
      await Categoria.findByIdAndRemove(id);
      return res.json('A categoria foi removida com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover a categoria.' });
    }
  }
}

export default new CategoriaController();
