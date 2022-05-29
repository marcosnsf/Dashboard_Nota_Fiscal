import Produto from '../model/Produto';
import Fornecedor from '../model/Fornecedor';
import Categoria from '../model/Categoria';
 
class ProdutoController {
  async iniciarFormularioProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const categorias = await Categoria.find({ usuarioId });
    const fornecedores = await Fornecedor.find({ usuarioId });
    const categoriasResponse = [];
    const fornecedoresResponse = [];
    const produtos = await Produto.find({ usuarioId });
    const produtosResponse = [];
    produtos.forEach((produto) => {
      produtosResponse.push({
        _id: `${produto._id}preco${produto.valorVenda}`,
        produto: `${produto.numnf} - R$${produto.valorVenda}`,
      });
    });
    categorias.forEach((categoria) => {
      categoriasResponse.push(`${categoria.secretaria} - ${categoria.gestor}`);
    });

    fornecedores.forEach((fornecedor) => {
      fornecedoresResponse.push(`${fornecedor.razaoSocial} - ${fornecedor.cnpj}`);
    });

    res.render('produtos/cadastrar', {
      categorias: categoriasResponse,
      fornecedores: fornecedoresResponse,
      produtos: produtosResponse,
      aprovacoes: ["LAUDO DE SECRETARIA OK", "LAUDO JURíDICO OK", "APROVADO","RESERVA ORÇAMENTARIA","PAGAMENTO OK"],
      situacoes: ["FECHADA", "ABERTA"],
    });
  }

  async buscarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const produto = await Produto.findOne({ _id: id, usuarioId });
    if (!produto) {
      return res.status(400).json({ message: 'O produto não foi encontrado.' });
    }
    return res.json(produto);
  }

  async listarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const produtos = await Produto.find({ usuarioId });
    const produtosResponse = [];
    produtos.map((produto) => {
      produtosResponse.push({
        id: produto._id,
        datanf: produto.datanf,
        numnf: produto.numnf,
        numemp: produto.numemp,
        numpedido: produto.numnf,
        numpedido: produto.numpedido,
        numcontrato: produto.numcontrato,
        datareceb: produto.datareceb,
        pedidocompra: produto.pedidocompra,
        preco: produto.valorVenda.toFixed(2),
        arquivo: produto.arquivo,
        // 
        arquivo1: produto.arquivo1,
        // 
        situacao: produto.situacao,
        aprovacao: produto.aprovacao,
        // 
        operador: produto.operador,
        // 
        // 
        dtmodificacao: produto.dtmodificacao, 
        //
        observation: produto.observation,
        //
        categoria: `${produto.secretaria} | ${produto.gestor}`,
        razaoSocialCnpj: `${produto.fornecedorRazaoSocial} | ${produto.fornecedorCnpj}`,
      });
    });
    res.render('produtos/listar', {
      produtos: produtosResponse,
    });
  }

  async buscarTodos(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const produtos = await Produto.find({ usuarioId });
    return res.json(produtos);
  }

  async salvarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;                                                                      //     //                        //    //  //          //             //          //
    const { datanf, numnf, numemp, numpedido, numcontrato, datareceb, pedidocompra, valorVenda, arquivo, arquivo1, observation, situacao, aprovacao, operador, dtmodificacao, categoria, fornecedor } = req.body;
    console.log(req.body);                                                                                                  //           //                        //         //
    if (!datanf || !numnf || !numemp || !numpedido || !numcontrato || !datareceb || !pedidocompra || !valorVenda || !arquivo|| !arquivo1 || !situacao || !aprovacao|| !operador || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'É obrigatório preencher todos os campos.' });
    }
    try {
      const produtoExistente = await Produto.findOne({ numnf, usuarioId });
      if (produtoExistente) {
        return res.status(400).json({ message: 'A nota fiscal já existe.' });
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
     
      await Produto.create({
        datanf: datanf,
        numnf: numnf,
        numemp: numemp,
        numpedido: numpedido,
        numcontrato: numcontrato,
        datareceb: datareceb,
        secretaria: categoriaExistente.secretaria,
        gestor: categoriaExistente.gestor,
        fornecedorRazaoSocial: fornecedorExistente.razaoSocial,
        fornecedorCnpj: fornecedorExistente.cnpj,
        arquivo,
        // 
        arquivo1,
        // 
        situacao,
        aprovacao,
        // 
        operador,
        // 
        // 
        dtmodificacao,
        //
        observation,
        //
        pedidocompra,
        valorVenda,
        usuarioId,
      });
      return res.json({ message: 'O produto foi inserido com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao salvar o produto.' });
    }
  }
  async editarProduto(req, res) {
    const { authUser } = req;
    const usuarioId = authUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    const produtoExistente = await Produto.findOne({ _id: id, usuarioId });
    if (!produtoExistente) {
      return res.status(400).json({ message: 'O produto não foi encontrado.' });
    }                                                                                                    //    //    //    //           //    //      //           //
    const { datanf, numnf, numemp, numpedido, numcontrato, datareceb, pedidocompra, valorVenda, arquivo, arquivo1, observation, situacao, aprovacao, operador, dtmodificacao, categoria, fornecedor } = req.body;
    if (!datanf || !numnf || !numemp || !numpedido || !numcontrato || !datareceb || !pedidocompra || !valorVenda || !arquivo|| !arquivo1 || !observation || !situacao || !operador || !aprovacao || !categoria || !fornecedor) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    if (valorVenda <= 0.0) {
      return res.status(400).json({
        message: 'O preço do produto não pode ser menor ou igual a 0.',
      });
    }
    //if (produtoExistente.produto === String(produtoExistente._id) !== String(id)) {
      //return res.status(400).json({ message: 'Este produto já está cadastrado.' });
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
      
      
      produtoExistente.datanf = datanf;
      produtoExistente.numnf = numnf;
      produtoExistente.numemp = numemp;
      produtoExistente.numcontrato = numcontrato;
      produtoExistente.datareceb = datareceb;
      produtoExistente.pedidocompra = pedidocompra;
      produtoExistente.valorVenda = valorVenda;
      produtoExistente.aprovacao = aprovacao;
      produtoExistente.arquivo = arquivo;
      //
      produtoExistente.arquivo1 = arquivo1;
      //
      //
      produtoExistente.operador = operador;
      //
      produtoExistente.dtmodificacao = dtmodificacao;
      //
      produtoExistente.observation = observation;
      //
      produtoExistente.situacao = situacao;
      produtoExistente.secretaria = categoriaExistente.secretaria;
      produtoExistente.gestor = categoriaExistente.gestor;
      produtoExistente.fornecedorCnpj = fornecedorExistente.cnpj;
      produtoExistente.fornecedorRazaoSocial = fornecedorExistente.razaoSocial;
      await produtoExistente.save();
      return res.json({ message: 'O produto foi atualizado com sucesso!' }); 
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao atualizar o produto.' });
    }
  }

  async removerProduto(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'O id é obrigatório.' });
    }
    try {
      await Produto.findByIdAndRemove(id);
      return res.json('O produto foi removido com sucesso!');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Houve um erro ao remover o produto.' });
    }
  }
}
export default new ProdutoController();
