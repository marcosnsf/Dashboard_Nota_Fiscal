const { application } = require('express');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const path = require("path");
mongoose.connect("mongodb://localhost:27017/notafiscal", { useNewUrlParser: true });

const multer = require("multer");

const storage = multer.diskStorage({

	destination: function(req, file, cb){
		cb(null, "uploads/");
	},
	filename: function(req, file, cb){

		cb(null, file.originalname + Date.now() + path.extname(file.originalname));

	}

});

const upload = multer({storage});



var Schema = mongoose.Schema;

// Define Database Schema
var TaskSchema = new Schema({
	
	datanf: {type: String},
	numnf: {type: String},
	numemp: {type: String},
	numpedido: {type: String},
	numcontrato: {type: String},
	datareceb: {type: String},
	valorVenda: {type: Number},
	secretaria: {type: String},
	gestor: {type: String},
	fornecedorCnpj: {type: String},
	fornecedorRazaoSocial: {type: String},
	aprovacao: {type: String},
	situacao: {type: String},
	pedidocompra: {type: String},
	operador: {type: String},
	dtmodificacao: {type: Date, default: Date.now},
	status: {type: Boolean},
	observation: {type: String},
	arquivo: {type: [String]},
	arquivo1: {type: [String]}

}, {collection: 'produtos'});


var Model = mongoose.Schema;

var IndicaSchema = new Model ( {

	datanf1: {type: String},
	numnf1: {type: String},
	numemp1: {type: String},
	numpedido1: {type: String},
	numcontrato1: {type: String},
	datareceb1: {type: String},
	valorVenda1: {type: Number},
	secretaria: {type: String},
	gestor: {type: String},
	fornecedorCnpj: {type: String},
	fornecedorRazaoSocial: {type: String},
	aprovacao: {type: String},
	situacao: {type: String},
	pedidocompra1: {type: String},
	operador1: {type: String},
	dtmodificacao1: {type: Date, default: Date.now},
	status: {type: Boolean},
	observation1: {type: String},
	arquivonf: {type: [String]},
	arquivolaudo: {type: [String]}

}, {collection: 'servicos'});



// Define Schema Object
var Task = mongoose.model('Task', TaskSchema);

// Define Schema Object
var Flask = mongoose.model('Flask', IndicaSchema);


/* GET Tasks page. */
router.get('/', function(req, res, next) {
	Task.find().sort({_id: -1})
	.then(function(docs) {
		res.render('tasks/index', {tasks: docs})

	})
});

router.get('/servicos', function(req, res, next) {
	Flask.find().sort({_id: -1})
	.then(function(docs1) {
		res.render('tasks/index1', {model: docs1})

	})
});
/* GET Task Single page. */
router.get('/view/id', function(req, res, next) {

	Task.findById(id)
	.then(function(docs) {
		res.render('tasks/show', {task: docs})

	})
});

router.get('/view/ip', function(req, res, next) {

	Flask.findById(id)
	.then(function(docs1) {
		res.render('tasks/show1', {model: docs1})

	})
});




/* GET Task Single page. */
router.get('/add', function(req, res, next) {
	res.render('tasks/create', {title: "Gereciador de Oficios", success: req.session.success, errors: req.session.errors});
});

router.get('/add1', function(req, res, next) {
	res.render('tasks/create1', {title1: "Gereciador de Oficios", success1: req.session.success1, errors1: req.session.errors1});
});


/* Post Task Single page. */
router.post('/store', upload.array('xs',[10]), function(req, res, next) {

	req.check('status', "Please give status for task").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/add');
	}else {
		req.session.success = true;

		var task = 
		{
			'data' : req.body.data,
			'datanf': req.body.datanf,
			'numnf': req.body.numnf,
			'numemp': req.body.numemp,
			'numpedido': req.body.numpedido,
			'numcontrato': req.body.numcontrato,
			'datareceb': req.body.datareceb,
			'valorVenda':req.body.valorVenda,
			'secretaria': req.body.secretaria,
			'gestor': req.body.gestor,
			'fornecedorCnpj': req.body.fornecedorCnpj,
			'fornecedorRazaoSocial': req.body.fornecedorRazaoSocial,
			'aprovacao':req.body.aprovacao,
			'situacao':req.body.situacao,
			'pedidocompra':req.body.pedidocompra,
			'operador':req.body.operador,
			'dtmodificacao':req.body.dtmodificacao,






			
			'status': req.body.status,
			'observation': req.body.observation,
			'arquivo' : original(req.file),
			'arquivo1' : original(req.file)


			
		};

		var task = new Task(task);
		task.save();res.redirect('/');
	}

});



router.post('/store1',upload.array('file', [10]), function(req, res, next) {

	

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/add1');
	}else {
		req.session.success = true;

		var flask = 
		{

			'datanf1': req.body.datanf1,
			'numnf1': req.body.numnf1,
			'numemp1': req.body.numemp1,
			'numpedido1': req.body.numpedido1,
			'numcontrato1': req.body.numcontrato1,
			'datareceb1': req.body.datareceb1,
			'valorVenda1':req.body.valorVenda1,
			'secretaria': req.body.secretaria,
			'gestor': req.body.gestor,
			'fornecedorCnpj': req.body.fornecedorCnpj,
			'fornecedorRazaoSocial': req.body.fornecedorRazaoSocial,
			'aprovacao':req.body.aprovacao,
			'situacao':req.body.situacao,
			'pedidocompra1':req.body.pedidocompra1,
			'operador1':req.body.operador1,
			'dtmodificacao1':req.body.dtmodificacao1,


			'observation1': req.body.observation1,
			'arquivonf' : original(req.file),
			'arquivolaudo' : original(req.file)

			
		};

		var flask = new Flask(flask);
		flask.save();res.redirect('/servicos');
	}

});

 function  original (file) {

	originalName = []

	var exemplo = file["originalname"]

	originalName.push(exemplo)


return(originalName)

}

		router.post('/update', function(req, res, next) {

			var id = req.body.id;
		

		//validate first
		req.check('status', "Please give status for task").notEmpty();

		var errors = req.validationErrors();
		if (errors) {
			req.session.errors = errors;
			req.session.success = false;
			res.redirect('/');
		}else {
			req.session.success = true;
			Task.findById(id, function (err, doc) {
				if (err) {
					console.log('Error To find the docs');
				}else {
					doc.datanf = req.body.datanf;
					doc.numnf = req.body.numnf;
					doc.numemp = req.body.numemp;
					doc.numpedido = req.body.numpedido;
					doc.numcontrato = req.body.numcontrato;
					doc.datareceb = req.body.datareceb;
					doc.numcontrato = req.body.numcontrato;
					doc.datareceb = req.body.datareceb;
					doc.valorVenda = req.body.valorVenda;
					doc.secretaria = req.body.secretaria;
					doc.gestor = req.body.gestor;
					doc.fornecedorRazaoSocial = req.body.fornecedorRazaoSocial;
					doc.fornecedorCnpj = req.body.fornecedorCnpj;
					doc.situacao = req.body.situacao;
					doc.aprovacao = req.body.aprovacao;
					
					doc.pedidocompra = req.body.pedidocompra;
					doc.operador = req.body.operador;
					doc.dtmodificacao = req.body.dtmodificacao;
					
					



					
				
					doc.arquivo = req.body.arquivo;
					doc.arquivo1 = req.body.arquivo1;
					doc.observation = req.body.observation;
					
					doc.save();
					res.redirect('/');
				} 
			})
		} 
	});


	router.post('/update1', function(req, res, next) {

		var id = req.body.id;
	

	//validate first
	req.check('status1', "Please give status for task").notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/servicos');
	}else {
		req.session.success = true;
		Flask.findById(id, function (err, doc) {
			if (err) {
				console.log('Error To find the docs');
			}else {
				
			
				doc.datanf1 = req.body.datanf1;
				doc.numnf1 = req.body.numnf1;
				doc.numemp1 = req.body.numemp1;
				doc.numpedido1 = req.body.numpedido1;
				doc.numcontrato1 = req.body.numcontrato1;
				doc.datareceb1 = req.body.datareceb1;
				doc.numcontrato1 = req.body.numcontrato1;
				doc.datareceb1 = req.body.datareceb1;
				doc.secretaria = req.body.secretaria;
				doc.gestor = req.body.gestor;
				doc.fornecedorRazaoSocial = req.body.fornecedorRazaoSocial;
				doc.fornecedorCnpj = req.body.fornecedorCnpj;
				doc.pedidocompra1 = req.body.pedidocompra1;
				doc.valorVenda1 = req.body.valorVenda1;
				doc.situacao = req.body.situacao;
				doc.aprovacao = req.body.aprovacao;
				
				doc.operador1 = req.body.operador1;
				doc.dtmodificacao1  = req.body.dtmodificacao1;
				
				



				
			
				doc.arquivonf = req.body.arquivonf;
				doc.arquivolaudo = req.body.arquivolaudo;
				doc.observation1  = req.body.observation1;
				
				doc.save();
				res.redirect('/servicos');
			} 
		})
	} 
});


	
			/* Delete Task */
			router.post('/delete', function(req, res, next) {
				var id = req.body.id;
				
				Task.findByIdAndRemove(id).exec();
			

				res.redirect('/');
			});

			router.post('/delete2', function(req, res, next) {
			
				var id = req.body.id;
			
				Flask.findByIdAndRemove(id).exec();

				res.redirect('/servicos');
			});





			module.exports = router;
