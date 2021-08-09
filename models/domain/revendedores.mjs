const _key = Symbol("key");
const _nome = Symbol("nome");
const _cpf = Symbol("cpf");
const _email = Symbol("email");
const _senha = Symbol("senha");

export class Revendedor {
  constructor(key, nome, cpf, email, senha) {
    this[_key] = key;
    this[_nome] = nome;
    this[_cpf] = cpf;
    this[_email] = email;
    this[_senha] = senha;
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
  get senha() {
    return this[_senha];
  }
  set senha(novaSenha) {
    this[_senha] = novaSenha;
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