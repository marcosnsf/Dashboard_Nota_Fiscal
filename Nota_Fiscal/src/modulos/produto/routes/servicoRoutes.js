import { Router } from "express";
  
import ServicoController from "../controller/ServicoController";

const router = new Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get("/produtos/listarServicos", ServicoController.listarTodos);
router.get("/produtos/cadastrarServicos", ServicoController.iniciarFormularioServico);
router.get(
  "/produtos/cadastrarServicos/:id", 
  ServicoController.iniciarFormularioServico
);

router.get("/api/servicos", ServicoController.buscarTodos);
router.get("/api/servico/:id", ServicoController.buscarServico);
router.post("/api/servicos", ServicoController.salvarServico);
router.post("uploads/", upload.single("arquivonf"), (req, res) => {
  console.log(req.body, req.file)
});
router.put("/api/servicos/:id", ServicoController.editarServico);
router.delete("/api/servicos/:id", ServicoController.removerServico);
 
export default router;
