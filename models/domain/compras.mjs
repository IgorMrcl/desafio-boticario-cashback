const _key = Symbol("key");
const _codigo = Symbol("codigo");
const _valor = Symbol("valor");
const _data = Symbol("data");
const _cpf = Symbol("cpf");
const _status = Symbol("status");

export class Compra {
    constructor(key, codigo, valor, data, cpf, status) {
      this[_key] = key;
      this[_codigo] = codigo;
      this[_valor] = valor;
      this[_data] = data;
      this[_cpf] = cpf;      
      this[_status] = status;
    }
  
    get key() {
      return this[_key];
    }
    get codigo() {
      return this[_codigo];
    }
    get valor() {
      return this[_valor];
    }
    get data() {
        return this[_data];
      }
    get cpf() {
      return this[_cpf];
    }
    get status() {
      return this[_status];
    }
    
  
    get JSON() {
      return JSON.stringify({
        key: this.key,
        codigo: this.codigo,
        valor: this.valor,
        data: this.data,
        cpf: this.cpf,
        status: this.status
      });
    }

    get raw() {
      return {
        key: this.key,
        codigo: this.codigo,
        valor: this.valor,
        data: this.data,
        cpf: this.cpf,
        status: this.status
      };
    }
  
    static fromJSON(json) {
      const inData = JSON.parse(json);
      if (
        typeof inData !== "object" ||
        !inData.hasOwnProperty("key") ||
        typeof inData.key !== "string" ||
        !inData.hasOwnProperty("codigo") ||
        typeof inData.codigo !== "string" ||
        !inData.hasOwnProperty("valor") ||
        typeof inData.valor !== "string" ||
        !inData.hasOwnProperty("data") ||
        typeof inData.data !== "string" ||
        !inData.hasOwnProperty("cpf") ||
        typeof inData.cpf !== "string" ||
        !inData.hasOwnProperty("status") ||
        typeof inData.status !== "string"
      ) {
        throw new Error(`Compra inválida: ${json}`);
      }
      const compra = new Compra(inData.key, inData.codigo, inData.valor, inData.data, inData.cpf, inData.status);
      return compra;
    }
  }