# Requisitos back-end: 
* Rota para cadastrar um novo revendedor(a) exigindo no mínimo nome completo, CPF, e- mail e senha; 
* Rota para validar um login de um revendedor(a); 
* Rota para cadastrar uma nova compra exigindo no mínimo código, valor, data e CPF do revendedor(a). Todos os cadastros são salvos com o status “Em validação” exceto quando o CPF do revendedor(a) for igual a um determinado cpf configurado na aplicação, neste caso o status é salvo como “Aprovado”; 
* Rota para listar as compras cadastradas retornando código, valor, data, % de cashback aplicado para esta compra, valor de cashback para esta compra e status; 
• Rota para exibir o acumulado de cashback até o momento;
	- Essa rota irá consumir uma API externa com o cabeçalho `headers { token: 'ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm' }` 

## Premissas do caso de uso: 

**Os critérios de bonificação são:**
* **Para até 1.000 reais** em compras, o revendedor(a) receberá **10% de cashback** do valor vendido no período de um mês (sobre a soma de todas as vendas);
* **Entre 1.000 e 1.500 reais** em compras, o revendedor(a) receberá **15% de cashback** do valor vendido no período de um mês (sobre a soma de todas as vendas);
* **Acima de 1.500 reais** em compras, o revendedor(a) receberá **20% de cashback** do valor vendido no período de um mês (sobre a soma de todas as vendas). 

## Requisitos : 

* Utilize a linguagem Nodejs; 
* Banco de dados relacional ou não relacional;
* Autenticação JWT; 
* Logs da aplicação.
