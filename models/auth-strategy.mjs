import { default as passport } from "passport";
import { default as passportLocal, Strategy } from "passport-local";
import { validatePassword, read } from "./service/revendedores-service.mjs";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import {default as jwt} from "jsonwebtoken";

passport.use(
  new Strategy(
    {
      usernameField: "cpf",
      passwordField: "senha",
      session: false,
    },
    async (cpf, senha, done) => {
      try {
        const revAutenticado = await validatePassword(cpf, senha);
        if (!revAutenticado) {
          throw new Error("Usuário ou Senha inválidos");
        }
        done(null, revAutenticado);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        const payload = jwt.verify(token, process.env.CHAVE_JWT);
        const revendedor = await read(payload.cpf);
        done(null, revendedor);
      } catch (error) {
        done(error);
      }
    
  })
)