import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountRepository";
import { transactionRepository } from "../repositories/transactionRepository";


export class TransactionController {

    async makeTransaction(req: Request, res: Response) {
        // INFORMAÇÕES DO DEBITANTE
        const { id: debitedId, username: debitedUsername, accountId: debitedAccountId } = req.user
        const debitedAccount = await accountRepository.findOneBy({ id: debitedAccountId })
        const debitedBalance = debitedAccount?.balance as number

        // INFORMAÇÕES DO CREDITANTE
        const { username: creditedtUsername, value: transactionValue } = req.body
        console.log(creditedtUsername,transactionValue);
        

        if (debitedUsername === creditedtUsername) {        // verficando se o usuario nao está tentando tranferir dinheiro para ele mesmo
            return res.status(401).json("Não é possivel tranferir dinheiro para si própio")
        }

        const fullCreditedAccount = await accountRepository.query(`SELECT * FROM "Users" u 
		INNER JOIN "Accounts" a 
        ON u."accountId" = a.id 
        WHERE u.username = '${creditedtUsername}'`) // pegadno todos os dados de conta do usuario creditante

        const { id: creditedId, username: creditedUser, accountId: creditedAccountId, balance: creditedBalance } = fullCreditedAccount[0]

        if (debitedBalance < transactionValue) {        // Verificando se o saldo da trasferencia é valido
            return res.status(400).json("Não é possivel transferir um valor maior doque o possuido em conta")
        }

        // lógica de valores para update de balance
        const descontDebAccount = debitedBalance - transactionValue
        const upCredAccount = creditedBalance + transactionValue

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
                return res.status(400).json("Erro ao efetuar transferencia")
            }

        } else { // Caso uma das tranferencias nao for um sucesso reestabelecer os valores originais as contas alteradas (Melhor maneira que encontrei, mas futuralmente alterarei isso, pois nao é uma maneira muito segura)
            await accountRepository.createQueryBuilder().update("Account").set({ balance: debitedBalance }).where("id = :id", { id: debitedId }).execute()
            await accountRepository.createQueryBuilder().update("Account").set({ balance: creditedBalance }).where("id = :id", { id: creditedId }).execute()

            return res.status(400).json("Erro ao efetuar transferencia")
        }

                    // CASO SEJA TUDO UM SUCESSO
        return res.status(200).json("transferencia efetuada com sucesso")
    }


    async getDebitedTranfer(req: Request, res: Response) {
        const { accountId } = req.user

        const DebitedTransactions = await transactionRepository.query(`SELECT * FROM "Transactions" 
		WHERE "debitedAccountId" = ${accountId}
		limit 5`)

        if (DebitedTransactions.length === 0) {
            return res.status(400).json("Usuario nao efetou nehuma transação como debitante")
        }
        return res.status(200).json(DebitedTransactions)

    }

    async getCreditedTranfer(req: Request, res: Response) {
        const { accountId } = req.user

        const creditedTransactions = await transactionRepository.query(`SELECT * FROM "Transactions" 
		WHERE "creditedAccountId" = ${accountId}
		limit 5`)

        if (creditedTransactions.length === 0) {
            return res.status(400).json("Usuario nao efetou nehuma transação como debitante")
        }
        return res.status(200).json(creditedTransactions)

    }
}