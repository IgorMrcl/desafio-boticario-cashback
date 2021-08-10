import { default as ComprasStore } from "../store/compras-store.mjs";
import { default as DBG } from "debug";
import { DateTime } from "luxon";

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

export async function list(cpf) {
  const compras = await compStore.comprasList(cpf);
  return compras;
}

export async function listComprasCashBack(cpf) {
  const consultas = await Promise.all([compStore.comprasTotalList(cpf), list(cpf)]);

  const compsTotMesAno = consultas[0];
  let compras = consultas[1];

  const comprsPrcntCashBack = compsTotMesAno.map((comp) => {
    comp.percentCashBack = defineCashBackPercent(comp.total);
    return comp;
  });

  //Transformar em código assincrono
  let newCompras = compras.map((compra) => {
    const objPercentCashback = comprsPrcntCashBack.find((obj) => checkCorrectCashBackPercent(obj, compra));

    return {
      codigo: compra.codigo,
      valor: compra.valor.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}),
      data: compra.data,
      PercentualCashBack: `${objPercentCashback.percentCashBack}%`,
      ValorCashBack: (compra.valor * (objPercentCashback.percentCashBack / 100)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}),
      status: compra.status,
    };
  });
  return newCompras;
}

//Transformar em código dinâmico para permitir a entrada de novos ranges via app config
function defineCashBackPercent(valorVendaMes) {
  switch (true) {
    case valorVendaMes <= process.env.BONIFICACAO_RANGE1:
      return process.env.BONIFICACAO_PERCENT1;
    case valorVendaMes <= process.env.BONIFICACAO_RANGE2:
      return process.env.BONIFICACAO_PERCENT2;
    default:
      return process.env.BONIFICACAO_PERCENT3;
  }
}

function checkCorrectCashBackPercent(objPercent, compra) {
  const dataCompra = DateTime.fromISO(compra.data);
  let ret = objPercent.cpf === compra.cpf && objPercent.mes == dataCompra.c.month && objPercent.ano == dataCompra.c.year;
  return ret;
}

