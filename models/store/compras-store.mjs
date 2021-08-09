import { Compra } from "../domain/compras.mjs";
import { AbstractStore } from "./abstract-model-store.mjs";
import Sequelize from "sequelize";
import { connectDB as connectSequlz, close as closeSequlz } from "../sequlz.mjs";
import { default as DBG } from "debug";

const debug = DBG("app:dev");
let sequelize;
export class SQComp extends Sequelize.Model {}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQComp.init(
    {
      compKey: { type: Sequelize.DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, unique: true, allowNull: false },
      codigo: Sequelize.DataTypes.STRING,
      valor: Sequelize.DataTypes.DECIMAL(10,2),
      data: Sequelize.DataTypes.DATEONLY,
      mes: Sequelize.DataTypes.SMALLINT,
      ano: Sequelize.DataTypes.SMALLINT,
      cpf: Sequelize.DataTypes.STRING,
      status: Sequelize.DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SQCompra",
    }
  );
  await SQComp.sync();
}

export default class RevendedoresStore extends AbstractStore {
  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async create(codigo, valor, data, cpf, status) {
    await connectDB();
    const ndate = new Date(data);
    const novaComp = await SQComp.create({
      codigo,
      valor,
      data,
      mes: ndate.getMonth() + 1,
      ano: ndate.getFullYear(),
      cpf,
      status,
    });
    return new Compra(novaComp.compKey, novaComp.codigo, novaComp.valor, novaComp.data, novaComp.cpf, novaComp.status);
  }

  async read(codigo) {
    await connectDB();
    const comp = await SQComp.findOne({ where: { codigo: codigo } });
    if (!comp) {
      throw new Error(`Compra não encontrada com a chave ${key}`);
    } else {
      return new Compra(comp.compKey, comp.codigo, comp.valor, comp.data, comp.cpf, comp.status);
    }
  }

  async comprasList() {
    await connectDB();
    const compras = await SQComp.findAll();
    const ret = compras.map((dbCompra) => {
      return new Compra(dbCompra.compKey, dbCompra.codigo, dbCompra.valor, dbCompra.data, dbCompra.cpf, dbCompra.status);      
    });    
    return ret;
  }

  async comprasTotalList() {
    await connectDB();
    const compras = await SQComp.findAll({
      attributes: ['cpf', 'mes', 'ano', [sequelize.fn('sum', sequelize.col('valor')), 'total']],	
      group : ['cpf', 'mes', 'ano'],    
      raw: true
    });
    return compras;
  }
}
