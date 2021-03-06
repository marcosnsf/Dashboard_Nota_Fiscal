import Fornecedor from '../model/Fornecedor';

class FornecedorController {
  async iniciarFormularioFornecedor(req, res) { 
    res.render('fornecedores/cadastrar');
  }

  async listarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const fornecedores = await Fornecedor.find({ usuarioId });
    const fornecedoresResponse = [];
    fornecedores.map((fornecedor) => {
      fornecedoresResponse.push({
        id: fornecedor._id,
        razaoSocial: fornecedor.razaoSocial,
        cnpj: fornecedor.cnpj,
        // 
        ncontrato: fornecedor.ncontrato,
        vigencia: fornecedor.vigencia,
        gestorcontrato: fornecedor.gestorcontrato,
        empenho: fornecedor.empenho,
        // 
      });
    });
    res.render('fornecedores/listar', {
      fornecedores: fornecedoresResponse,
    });
  }

  async buscarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const fornecedores = await Fornecedor.find({ usuarioId });
    return res.json(fornecedores);
  }

  async buscarPorId(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'É obrigatório informar o id.',
      });
    }
    try {
      const fornecedor = await Fornecedor.findOne({ _id: id, usuarioId });
      if (!fornecedor) {
        return res.status(400).json({
          message: 'O fornecedor não foi encontrado.',
        });
      }
      return res.json(fornecedor);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao buscar o fornecedor.' });
    }
  }

  async salvarFornecedor(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
                               //                                         //        //                                                             
    const { razaoSocial, cnpj, ncontrato, vigencia, gestorcontrato, empenho} = req.body;
    if (!razaoSocial || !cnpj ||!ncontrato || !vigencia ||!gestorcontrato || !empenho) {
      return res.status(400).json({ message: 'É obrigatório preencher todos os campos.' });
    }
    const fornecedorExistente = await Fornecedor.findOne({ cnpj });
    // if (fornecedorExistente) {
    //   return res.status(400).json({ message: 'Já existe um fornecedor para este CNPJ.' });
    // }
    try {                                         //                                          //
      await Fornecedor.create({ razaoSocial, cnpj, ncontrato, vigencia, gestorcontrato, empenho, usuarioId });
      return res.json({
        message: 'Os fornecedores foram inseridos com sucesso!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar o fornecedor.' });
    }
  }

  async editarFornecedor(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'É obrigatório informar o id.',
      });
    }
    const { razaoSocial, cnpj, ncontrato, vigencia, gestorcontrato, empenho } = req.body;
    if (!razaoSocial || !cnpj ||!ncontrato || !vigencia ||!gestorcontrato || !empenho) {
      return res.status(400).json({ message: 'É obrigatório preencher todos os campos.' });
    }
    const fornecedorCnpj = await Fornecedor.findOne({ cnpj, usuarioId });
    if (fornecedorCnpj && String(fornecedorCnpj._id) !== String(id)) {
      return res.status(400).json({ message: 'Já existe um fornecedor para este CNPJ.' });
    }
    const fornecedor = await Fornecedor.findById(id);
    fornecedor.razaoSocial = razaoSocial;
    fornecedor.cnpj = cnpj;
    // 
    fornecedor.ncontrato = ncontrato;
    fornecedor.vigencia = vigencia;
    fornecedor.gestorcontrato = gestorcontrato;
    fornecedor.empenho = empenho;
    // 
    try {
      await fornecedor.save();
      return res.json({
        message: 'O fornecedor foi atualizado com sucesso!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar o fornecedor.' });
    }
  }

  async removerFornecedor(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      const fornecedor = await Fornecedor.findOne({ _id: id, usuarioId });
      if (!fornecedor) {
        return res.status(400).json({ message: 'O fornecedor não foi encontrado.' });
      }
      await Fornecedor.findByIdAndRemove(id);
      return res.json('O fornecedor foi removido com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover o fornecedor.' });
    }
  }
}
export default new FornecedorController();
