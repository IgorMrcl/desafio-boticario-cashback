import { default as RevendedoresStore } from "../store/revendedores-store.mjs";

const revStore = new RevendedoresStore();

export async function create(nome, cpf, email, senha){
   const novoRev = await revStore.create(nome, cpf, email, senha);
   return novoRev;
}

export async function read(cpf){
    const rev = await revStore.read(cpf);
    return rev;
}