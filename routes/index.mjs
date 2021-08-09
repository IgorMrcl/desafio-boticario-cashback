import { default as express } from "express";
import { create as createCompra, read as readCompra, list as listCompra, listTotal } from "../models/service/compras-service.mjs";
import { create as createRevendedor, read as readRevendedor } from "../models/service/revendedores-service.mjs";
export const router = express.Router();
import { default as DBG } from "debug";

const debugError = DBG("app:error");
const debug = DBG("app:dev");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ title: "Express" });
});

router.post("/revendedor", async (req, res, next) => {
  try {
    const novoRevendedor = await createRevendedor(req.body.nome, req.body.cpf, req.body.email, req.body.senha);
    res.send(novoRevendedor.raw);
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.get("/revendedor", async (req, res, next) => {
  try {
   
    const rev = await readRevendedor(req.query.cpf);
    res.contentType = "json";
    res.send({
      key: rev.key,
      nome: rev.nome,
      cpf: rev.cpf,
      email: rev.email,
    });
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.post("/compras", async (req, res, next) => {
  try {    
    const compra = await createCompra(req.body.codigo, req.body.valor, req.body.data, req.body.cpf);    
    res.send(compra.raw);
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.get("/compras", async (req, res, next) => {
  try {    
    const compra = await readCompra(req.query.codigo);
    res.send(compra.raw);    
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.get("/compras/listar", async (req, res, next) => {
  try {        
    let compras = await listCompra();    
    compras = compras.map(compra => {
      return compra.raw
    });   
    res.send(compras);
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.get("/compras/listarTodos", async (req, res, next) => {
  try {
    const listaCashBack = await listTotal();         
    res.send(listaCashBack);
  } catch (error) {
    debugError(error);
    next(error);
  }
});