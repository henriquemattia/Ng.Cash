import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-erros";
import { accountRepository } from "../repositories/accountRepository";
import { transactionRepository } from "../repositories/transactionRepository";

type User = {
    id: number;
    username: string;
    accountId: number;
    balance: number;
}

type Transfer  = {
    username: string,
    value: number
}

export class TransactionController {

    async makeTransaction(req: Request, res: Response) {
        // INFORMAÇÕES DO DEBITANTE
        const { id: debitedId, username: debitedUsername, accountId: debitedAccountId } = req.user as User
        const debitedAccount = await accountRepository.findOneBy({ id: debitedAccountId })
        const debitedBalance = debitedAccount?.balance as number

        // INFORMAÇÕES DO CREDITANTE
        const { username: creditedtUsername, value: transactionValue } = req.body as Transfer
        

        if (debitedUsername === creditedtUsername) {        // verficando se o usuario nao está tentando tranferir dinheiro para ele mesmo
            throw new BadRequestError("Não é possivel tranferir dinheiro para si própio")
        }

        const fullCreditedAccount = await accountRepository.query(`SELECT * FROM "Users" u 
		INNER JOIN "Accounts" a 
        ON u."accountId" = a.id 
        WHERE u.username = '${creditedtUsername}'`) // pegadno todos os dados de conta do usuario creditante

        const { id: creditedId, username: creditedUser, accountId: creditedAccountId, balance: creditedBalance } = fullCreditedAccount[0] as User

        if (debitedBalance < transactionValue) {        // Verificando se o saldo da trasferencia é valido
            throw new BadRequestError("Não é possivel transferir um valor maior doque o possuido em conta")
        }

        // lógica de valores para update de balance
        const upCredAccount = Number(creditedBalance) + Number(transactionValue) as number
        const descontDebAccount = debitedBalance - transactionValue as number
        
        // atualizando valores com novos balances
        const updatingDebAccount = await accountRepository.createQueryBuilder().update("Account").set({ balance: descontDebAccount }).where("id = :id", { id: debitedId }).execute()
        const updatingCredAccount = await accountRepository.createQueryBuilder().update("Account").set({ balance: upCredAccount }).where("id = :id", { id: creditedId }).execute()

        // Pegando data e hora atual
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const date = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        // data e hora no formato YYYY-MM-DD 

        // Registradno na tabela dae transferencia foram um sucesso
        if (updatingCredAccount && updatingDebAccount) {

            const transaction = transactionRepository.create({
                value: transactionValue,
                createdAt: `${year}-${month}-${date}`,
                debitedAccount: debitedAccountId,
                creditedAccount: creditedAccountId
            })
            const verifyTransaction = await transactionRepository.save(transaction)
            
            if (!verifyTransaction) {
                throw new BadRequestError("Erro ao efetuar transferencia")
            }

        } else { // Caso uma das tranferencias nao for um sucesso reestabelecer os valores originais as contas alteradas (Melhor maneira que encontrei, mas futuralmente alterarei isso, pois nao é uma maneira muito segura)
            await accountRepository.createQueryBuilder().update("Account").set({ balance: debitedBalance }).where("id = :id", { id: debitedId }).execute()
            await accountRepository.createQueryBuilder().update("Account").set({ balance: creditedBalance }).where("id = :id", { id: creditedId }).execute()

            throw new BadRequestError("Erro ao efetuar transferencia")
        }

                    // CASO SEJA TUDO UM SUCESSO
        return res.status(200).json("transferencia efetuada com sucesso")
    }

}