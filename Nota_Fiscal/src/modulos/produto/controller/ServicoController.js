import Servico from '../model/Servico';
import Fornecedor from '../model/Fornecedor';
import Categoria from '../model/Categoria';

class ServicoController {
  async iniciarFormularioServico(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ usuarioId });
    const fornecedores = await Fornecedor.find({ usuarioId });
    const categoriasResponse = [];
    const fornecedoresResponse = [];
    const servicos = await Servico.find({ usuarioId }); 
    const servicosResponse = [];
    servicos.forEach((servico) => {
      servicosResponse.push({
        _id: `${servico._id}preco${servico.valorVenda1}`,
        servico: `${servico.numnf1} - R$${servico.valorVenda1}`,
      });
    });
    categorias.forEach((categoria) => {
      categoriasResponse.push(`${categoria.secretaria} - ${categoria.gestor}`);
    });

    fornecedores.forEach((fornecedor) => {
      fornecedoresResponse.push(`${fornecedor.razaoSocial} - ${fornecedor.cnpj}`);
    });

    res.render('produtos/cadastrarServicos', {
      categorias: categoriasResponse,
      fornecedores: fornecedoresResponse,
      servicos: servicosResponse,
      aprovacoes: ["APROVADA", "REJEITADA", "AGUARDANDO_APROVACAO"],
      situacoes: ["FECHADA", "ABERTA"],
    });
  }

  async buscarServico(req, res) {
    const { authUser } = req; 
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const servico = await Servico.findOne({ _id: id, usuarioId });
    if (!servico) {
      return res.status(400).json({ message: 'O serviço não foi encontrado.' });
    }
    return res.json(servico);
  }

  async listarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const servicos = await Servico.find({ usuarioId });
    const servicosResponse = [];
    servicos.map((servico) => {
      servicosResponse.push({
        id: servico._id,
        datanf1: servico.datanf1,
        numnf1: servico.numnf1,
        numemp1: servico.numemp1,
        numpedido1: servico.numnf1,
        numpedido1: servico.numpedido1,
        numcontrato1: servico.numcontrato1,
        datareceb1: servico.datareceb1,
        pedidocompra1: servico.pedidocompra1,
        preco1: servico.valorVenda1.toFixed(2),
        arquivonf: servico.arquivonf,
        // 
        arquivolaudo: servico.arquivolaudo,
        // 
        situacao: servico.situacao,
        aprovacao: servico.aprovacao,
        // 
        operador1: servico.operador,
        // 
        dtmodificacao1: servico.dtmodificacao1, 
        //
        observation1: servico.observation1,
        //
        categoria: `${servico.secretaria} | ${servico.gestor}`,
        razaoSocialCnpj: `${servico.fornecedorRazaoSocial} | ${servico.fornecedorCnpj}`,
      });
    });
    res.render('produtos/listarServicos', {
      servicos: servicosResponse,
    });
  }

  async buscarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const servicos = await Servico.find({ usuarioId });
    return res.json(servicos);
  }

  async salvarServico(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;                                                                    //     //                        //    //  //          //             //          //
    const { datanf1, numnf1, numemp1, numpedido1, numcontrato1, datareceb1, pedidocompra1, valorVenda1, arquivonf, arquivolaudo, observation1, situacao, aprovacao, operador1, dtmodificacao1, categoria, fornecedor } = req.body;
    console.log(req.body);                                                                                                  //           //                        //         //
    if (!datanf1 || !numnf1 || !numemp1 || !numpedido1 || !numcontrato1 || !datareceb1 || !pedidocompra1 || !valorVenda1 || !arquivonf|| !arquivolaudo || !situacao || !aprovacao|| !operador1 || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'É obrigatório preencher todos os campos.' });
    }
    try {
      const servicoExistente = await Servico.findOne({ numnf1, usuarioId });
      if (servicoExistente) {
        return res.status(400).json({ message: 'O serviço já existe.' });
      }
      const cnpj = fornecedor.split(' - ')[1];
      if (!cnpj) {
        return res.status(400).json({ message: 'O CNPJ não foi informado.' });
      }
      const fornecedorExistente = await Fornecedor.findOne({ cnpj, usuarioId });
      if (!fornecedorExistente) {
        return res.status(400).json({ message: 'O fornecedor não existe.' });
      }
      const secretaria = categoria.split(' - ')[0];
      const categoriaExistente = await Categoria.findOne({ secretaria, usuarioId });
      if (!categoriaExistente) {
        return res.status(400).json({ message: 'A categoria não existe.' });
      }
     
      await Servico.create({
        datanf1: datanf1,
        numnf1: numnf1,
        numemp1: numemp1,
        numpedido1: numpedido1,
        numcontrato1: numcontrato1,
        datareceb1: datareceb1,
        secretaria: categoriaExistente.secretaria,
        gestor: categoriaExistente.gestor,
        fornecedorRazaoSocial: fornecedorExistente.razaoSocial,
        fornecedorCnpj: fornecedorExistente.cnpj,
        arquivonf,
        // 
        arquivolaudo,
        // 
        situacao,
        aprovacao,
        // 
        operador1,
        // 
        // 
        dtmodificacao1,
        //
        observation1,
        //
        pedidocompra1,
        valorVenda1,
        usuarioId,
      });
      return res.json({ message: 'O serviço foi inserido com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar o serviço.' });
    }
  }
  async editarServico(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const servicoExistente = await Servico.findOne({ _id: id, usuarioId });
    if (!servicoExistente) {
      return res.status(400).json({ message: 'O servico não foi encontrado.' });
    }                                                                                                    //    //    //    //           //    //      //           //
    const { datanf1, numnf1, numemp1, numpedido1, numcontrato1, datareceb1, pedidocompra1, valorVenda1, arquivonf, arquivolaudo , observation1, situacao, aprovacao, operador1, dtmodificacao1, categoria, fornecedor } = req.body;
    if (!datanf1 || !numnf1 || !numemp1 || !numpedido1 || !numcontrato1 || !datareceb1 || !pedidocompra1 || !valorVenda1 || !arquivonf|| !arquivolaudo || !situacao || !aprovacao || !operador1 || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (valorVenda1 <= 0.0) {
      return res.status(400).json({
        message: 'O preço do servico não pode ser menor ou igual a 0.',
      });
    }
    //if (servicoExistente.servico === String(servicoExistente._id) !== String(id)) {
      //return res.status(400).json({ message: 'Este servico já está cadastrado.' });
   // }
    try {
      const cnpj = fornecedor.split(' - ');
      if (!cnpj) {
        return res.status(400).json({ message: 'O CNPJ não foi informado.' });
      }
      const fornecedorExistente = await Fornecedor.findOne({ cnpj, usuarioId });
      if (!fornecedorExistente) {
        return res.status(400).json({ message: 'O fornecedor não existe.' });
      }
      const secretaria = categoria.split(' - ');
      if (!secretaria) {
        return res.status(400).json({ message: 'A secretaria não foi informado.' });
      }
      const categoriaExistente = await Categoria.findOne({ secretaria, usuarioId });
      if (!categoriaExistente) {
        return res.status(400).json({ message: 'A categoria não existe.' });
      }
      
      
      servicoExistente.datanf1 = datanf1;
      servicoExistente.numnf1 = numnf1;
      servicoExistente.numemp1 = numemp1;
      servicoExistente.numcontrato1 = numcontrato1;
      servicoExistente.datareceb1 = datareceb1;
      servicoExistente.pedidocompra1 = pedidocompra1;
      servicoExistente.valorVenda1 = valorVenda1;
      servicoExistente.aprovacao = aprovacao;
      servicoExistente.arquivonf = arquivonf;
      //
      servicoExistente.arquivolaudo = arquivolaudo;
      //
      //
      servicoExistente.operador1 = operador1;
      //
      servicoExistente.dtmodificacao1 = dtmodificacao1;
      //
      servicoExistente.observation1 = observation1;
      servicoExistente.situacao = situacao;
      servicoExistente.secretaria = categoriaExistente.secretaria;
      servicoExistente.gestor = categoriaExistente.gestor;
      servicoExistente.fornecedorCnpj = fornecedorExistente.cnpj;
      servicoExistente.fornecedorRazaoSocial = fornecedorExistente.razaoSocial;
      await servicoExistente.save();
      return res.json({ message: 'O serviço foi atualizado com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao atualizar o serviço.' });
    }
  }

  async removerServico(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      await Servico.findByIdAndRemove(id);
      return res.json('O servico foi removido com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover o servico.' });
    }
  }
}
export default new ServicoController();
