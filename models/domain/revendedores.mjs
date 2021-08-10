import {default as bcrypt} from "bcrypt";

const _key = Symbol("key");
const _nome = Symbol("nome");
const _cpf = Symbol("cpf");
const _email = Symbol("email");
const _senhaHash = Symbol("senhaHash");

export class Revendedor {
  constructor(key, nome, cpf, email, senha) {
    this[_key] = key;
    this[_nome] = nome;
    this[_cpf] = cpf;
    this[_email] = email;
    this[_senhaHash] = gerarSenhaHash(senha);
  }

  get key() {
    return this[_key];
  }
  get nome() {
    return this[_nome];
  }
  get cpf() {
    return this[_cpf];
  }
  get email() {
    return this[_email];
  }
  set email(novoEmail) {
    this[_email] = novoEmail;
  }
  get senhaHash() {
    return this[_senhaHash];
  }
  set senhaHash(novaSenhaHash) {
    this[_senhaHash] = novaSenhaHash;
  }

  get JSON() {
    return JSON.stringify({
      key: this.key,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email
    });
  }

  get raw() {
    return {
      key: this.key,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email
    };
  }

  

  static fromJSON(json) {
    const data = JSON.parse(json);
    if (
      typeof data !== "object" ||
      !data.hasOwnProperty("key") ||
      typeof data.key !== "string" ||
      !data.hasOwnProperty("nome") ||
      typeof data.nome !== "string" ||
      !data.hasOwnProperty("cpf") ||
      typeof data.cpf !== "string" ||
      !data.hasOwnProperty("email") ||
      typeof data.email !== "string"
    ) {
      throw new Error(`Revendedor inválido: ${json}`);
    }
    const rev = new Revendedor(data.key, data.nome, data.cpf, data.email);
    return rev;
  }
}

export async function gerarSenhaHash(senha) {
  const custoHash = 12;
  return await bcrypt.hash(senha, custoHash)
}