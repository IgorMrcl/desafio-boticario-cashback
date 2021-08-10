import { default as RevendedoresStore } from "../store/revendedores-store.mjs";
import { gerarSenhaHash } from "../domain/revendedores.mjs";
import { default as bcrypt } from "bcrypt";
import { default as jwt } from "jsonwebtoken";

const revStore = new RevendedoresStore();

export async function create(nome, cpf, email, senha) {
  const novoRev = await revStore.create(nome, cpf, email, await gerarSenhaHash(senha));
  return novoRev;
}

export async function read(cpf) {
  const rev = await revStore.read(cpf);
  return rev;
}

export async function validatePassword(cpf, senha) {
  const rev = await revStore.readPassword(cpf);
  const senhaValida = await bcrypt.compare(senha, rev.senhaHash);
  if (senhaValida) {
    return rev;
  } else {
    return false;
  }
}

export async function createTokenJWT(revendedor) {
  const payload = {
    key: revendedor.key,
    cpf: revendedor.cpf
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT, {expiresIn: "50m"});
  return token;
}
