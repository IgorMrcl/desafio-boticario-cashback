import { default as express } from "express";
import { create as createCompra, read as readCompra, list as listCompra, listComprasCashBack } from "../models/service/compras-service.mjs";
import { create as createRevendedor, read as readRevendedor, createTokenJWT } from "../models/service/revendedores-service.mjs";
export const router = express.Router();
import { default as DBG } from "debug";
import { default as passport } from "passport";
import { default as https } from "https";

const debugError = DBG("app:error");

router.post("/revendedor/login", passport.authenticate("local", { session: false }), async (req, res, next) => {
  const token = await createTokenJWT(req.user);
  res.set("Authorization", token);
  res.send({ status: "Usuário autenticado" });
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

// router.get("/revendedor", async (req, res, next) => {
//   try {
//     const rev = await readRevendedor(req.query.cpf);
//     res.contentType = "json";
//     res.send({
//       key: rev.key,
//       nome: rev.nome,
//       cpf: rev.cpf,
//       email: rev.email,
//     });
//   } catch (error) {
//     debugError(error);
//     next(error);
//   }
// });

router.post("/compra", passport.authenticate("bearer", { session: false }), async (req, res, next) => {
  try {
    const compra = await createCompra(req.body.codigo, req.body.valor, req.body.data, req.user.cpf);
    res.send(compra.raw);
  } catch (error) {
    debugError(error);
    next(error);
  }
});

// router.get("/compra", async (req, res, next) => {
//   try {
//     const compra = await readCompra(req.query.codigo);
//     res.send(compra.raw);
//   } catch (error) {
//     debugError(error);
//     next(error);
//   }
// });

// router.get("/compras/listarSemCashBack", passport.authenticate("bearer", { session: false }), async (req, res, next) => {
//   try {
//     let compras = await listCompra(req.user.cpf);
//     compras = compras.map((compra) => {
//       return compra.raw;
//     });
//     res.send(compras);
//   } catch (error) {
//     debugError(error);
//     next(error);
//   }
// });

router.get("/compras", passport.authenticate("bearer", { session: false }), async (req, res, next) => {
  try {
    const listaCashBack = await listComprasCashBack(req.user.cpf);
    res.send(listaCashBack);
  } catch (error) {
    debugError(error);
    next(error);
  }
});

router.get("/compras/cashback/total", passport.authenticate("bearer", { session: false }), async (req, res, next) => {
  try {
    var options = {
      host: process.env.ROTA_EXTERNA_CB_ACUMULADO_HOST,
      path: `${process.env.ROTA_EXTERNA_CB_ACUMULADO_PATH}${req.user.cpf}`,
      headers: { token: `${process.env.ROTA_EXTERNA_CB_ACUMULADO_HEADER_TOKEN_VALUE}` },
    };
    let Remotereq = https.get(options, (remoteResp) => {
      let data = "";
      remoteResp.on("data", (chunk) => {
        data += chunk;
      });

      remoteResp.on("end", () => {
        data = JSON.parse(data);
        res.contentType = "json";
        res.send({ 
          CashBackTotal: data.body.credit
        });
      });
    });
  } catch (error) {
    debugError(error);
    next(error);
  }
});
