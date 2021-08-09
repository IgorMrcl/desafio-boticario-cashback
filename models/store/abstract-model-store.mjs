export class AbstractStore {
  async close() {}
  async update(key, nome, cpf, email, senha) {}
  async create(key, nome, cpf, email, senha) {}
  async read(key) {}
  async destroy(key) {}
  async keylist() {}
  async count() {}
}
