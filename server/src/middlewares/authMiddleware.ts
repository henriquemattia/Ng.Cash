import { accountRepository } from '../repositories/accountRepository'
import { userRepository } from '../repositories/userRepository'
import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-erros'
import jwt from 'jsonwebtoken'

/*
MIDDLEWARE de verifdicação de token, todas as rotas que passaram por esse middlere teão de ter um token válido!

será verifiado se o token enviado na requisição é valido1
caso sej avalido, ira devolver o id, nome e accountId do usuario

para a devolução de account id, foi necessario uma leve gambiarra pois o typeorm nao estava conseguindo fazer uma busca completa retornando apenas nome e id de usuaio

será coprrigido em uma refatoração futura

manterei assim por agora, pois o foco é terminar as outras funcionalidades da API

 */


type JwtPayload = {
	id: number
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers
	// console.log(authorization);
	// console.log(authorization);
	
	// caso nao tenha nehum token na requisição
	if (!authorization) {
		throw new UnauthorizedError('Não autorizado')
	}

	const token = authorization.split(' ')[1]

	// verificando validade de token
	const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

	// buscando user id e username
	const user = await userRepository.findOneBy({ id })

	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	const fullUserAccount = await accountRepository.query(`SELECT * FROM "Users" u 
			INNER JOIN "Accounts" a 
			ON u.id = a.id 
			WHERE u.id = ${id}`
		)


	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}



	const { password: _, ...loggedUser } = fullUserAccount[0]



	
	req.user = loggedUser
	

	next()
}
