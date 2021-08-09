import { default as ComprasStore } from "../store/compras-store.mjs";
import { default as DBG } from "debug";

const debug = DBG("app:dev");
const compStore = new ComprasStore();

export async function create(codigo, valor, data, cpf) {
  const status = cpf === process.env.CPF_APROVACAO_AUT ? "Aprovado" : "Em validação";
  const novaCompra = await compStore.create(codigo, valor, data, cpf, status);
  return novaCompra;
}

export async function read(codigo) {
  const compra = await compStore.read(codigo);
  return compra;
}

export async function list() {
  const compras = await compStore.comprasList();
  return compras;
}

export async function listTotal() {
  const consultas = await Promise.all([compStore.comprasTotalList(), list()]);

  const compsTotMesAno = consultas[0];
  let compras = consultas[1];

  const comprsPrcntCashBack = compsTotMesAno.map((comp) => {
    comp.percentCashBack = defineCashBackPercent(comp.total);
    return comp;
  });

  
  let newCompras = compras.map((compra) => {
    
    const objPercentCashback = comprsPrcntCashBack.find(obj => checkCorrectCashBackPercent(obj, compra));
    
    return {
      codigo: compra.codigo,
      valor: compra.valor,
      data: compra.data,
      PercentualCashBack: `${objPercentCashback.percentCashBack}%`,
      ValorCashBack: compra.valor * (objPercentCashback.percentCashBack / 100),
      status: compra.status,
    };
  });
  return newCompras;
}

function defineCashBackPercent(valorVendaMes) {
  switch (true) {
    case valorVendaMes <= 1000:
      return 10;
    case valorVendaMes <= 1500:
      return 15;
    default:
      return 20;
  }
}

function checkCorrectCashBackPercent(objPercent, compra){
  const dataCompra = new Date(compra.data);
  let ret = objPercent.cpf === compra.cpf && objPercent.mes == (dataCompra.getMonth() + 1) && objPercent.ano == dataCompra.getFullYear();
  // debug(`Comparacao de cpf ${objPercent.cpf} e ${compra.cpf} é igual a ${objPercent.cpf === compra.cpf}`);
  // debug(`Comparacao de mes ${objPercent.mes} e ${(dataCompra.getMonth() + 1)} é igual a ${objPercent.mes == (dataCompra.getMonth() + 1)}`);
  // debug(`Comparacao de ano ${objPercent.ano} e ${dataCompra.getFullYear()} é igual a ${objPercent.ano == dataCompra.getFullYear()}`);
  // debug(`Comparacao final deu ${ret}`);
  return ret;
}
