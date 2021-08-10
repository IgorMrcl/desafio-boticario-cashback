import { Revendedor } from "../domain/revendedores.mjs";
import { AbstractStore } from "./abstract-model-store.mjs";
import Sequelize from "sequelize";
import { connectDB as connectSequlz, close as closeSequlz } from "../sequlz.mjs";

let sequelize;
export class SQRev extends Sequelize.Model {}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQRev.init(
    {
      Revkey: { type: Sequelize.DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, unique: true, allowNull: false },
      nome: Sequelize.DataTypes.STRING,
      cpf: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      senha: Sequelize.DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SQRevendedor",
    }
  );
  await SQRev.sync();
}

export default class RevendedoresStore extends AbstractStore {
  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async create(nome, cpf, email, senha) {
    await connectDB();
    const novoRev = await SQRev.create({      
      nome,
      cpf,
      email,
      senha,
    });
    return new Revendedor(novoRev.key, novoRev.nome, novoRev.cpf, novoRev.email, "");
  }

  async read(cpf) {
    await connectDB();
    const rev = await SQRev.findOne({ where: { cpf: cpf } });
    if (!rev) {
      throw new Error(`Revendedor não encontrado com o cpf ${cpf}`);
    } else {
      return new Revendedor(rev.key, rev.nome, rev.cpf, rev.email, "");
    }
  }

  async readPassword(cpf) {
    await connectDB();
    const rev = await SQRev.findOne({ where: { cpf: cpf } });
    if (!rev) {
      throw new Error(`Revendedor não encontrado com o cpf ${cpf}`);
    } else {
      const objRev = new Revendedor(rev.Revkey, rev.nome, rev.cpf, rev.email, "");
      objRev.senhaHash = rev.senha;
      return objRev;
    }
  }
}
