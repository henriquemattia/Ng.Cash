import { Request, Response } from 'express'
import { BadRequestError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { accountRepository } from '../repositories/accountRepository'
import { transactionRepository } from '../repositories/transactionRepository'


type JwtPayload = {
	id: number
}

export class UserController {

	//  CADASTRE-SE
async create(req: Request, res: Response) {
	const { username, password } = req.body
	
		 // verificando se Usename tem no minimo 3 caracteres
	const regexUsername = new RegExp(/^.{3,}$/)
	if(regexUsername.test(username) == false){
		console.log("Nome em formato incorreto")
		res.status(401).json("Nome em formato incorreto!")
	}

	//  verificando se o password tem os requisitps minimo de 1 minuscula, 1 maiscula, caracter especial, 1 numero, e no minimo 8 caracteres no total
	const regexPassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)  
	if(regexPassword.test(password) == false){
		console.log('Senha em formato incorreto')
		return res.status(401).json("Senha em formato incorreto")
	}
	

	//Busca por username no BD
	const userExists = await userRepository.findOneBy({ username })

	// verificando se o usuário já existe com base
	if (userExists) {
		throw new BadRequestError('Nome de usuário já existe')
	}

	//Encriptografando senha de usuário
	const hashPassword = await bcrypt.hash(password, 10)

	// criando uma conta nova para o usuario
	const newUserAccount = accountRepository.create({
		balance: 100
	})
	await accountRepository.save(newUserAccount)

	//propriedades de ciação de usuário
	const newUser = userRepository.create({
		username,
		password: hashPassword,
		accountId: newUserAccount.id
	})


	const verifyUserCreate = await userRepository.save(newUser)

	//caso ocorra algum problema o account de usuario rem criado sera deletado, e retornar um erro
	if (!verifyUserCreate) {
		accountRepository.remove(newUserAccount)
		return res.status(401).json("erro ao cirar usuario")
	}
	
	return res.status(200).json('Conta criada com sucesso')

	// const { password: _, ...user } = newUser
	// return res.status(201).json({
	// 	user: user,
	// 	account: newUserAccount
	// })
}

	




	// LOGIN

	async login(req: Request, res: Response) {
		const { username, password } = req.body

		

		const user = await userRepository.findOneBy({ username })

		if (!user) {
			throw new BadRequestError('Nome ou senha inválidos')
		}

		const verifyPass = await bcrypt.compare(password, user.password)

		if (!verifyPass) {
			throw new BadRequestError('Nome ou senha inválidos')
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
			expiresIn: '1d',
		})


		// ppegando conta copleta e balance do user
		const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

		// const trest = await userRepository.createQueryBuilder("Users").innerJoin("Accounts", "a", "Users.id = a.id ").where("Users.id = :id", {id: id}).getMany()
		const fullUserAccount = await accountRepository.query(`SELECT * FROM "Users" u 
			INNER JOIN "Accounts" a 
			on u."accountId" = a.id 
			WHERE u.id = ${id}`)

		const { password: _, ...userLogin } = fullUserAccount[0]

		return res.status(200).json({
			user: userLogin,
			token: token,
		})
	}

	// pegando dados do usuario

	async getProfile(req: Request, res: Response) {

		const { accountId } = req.user
		const allTransactions = await transactionRepository.query(`SELECT * FROM "Transactions" 
		WHERE "debitedAccountId" = ${accountId} 
		OR "creditedAccountId" = ${accountId}
		limit 5`)

		const userData = [{"user":req.user},{"allTransacions": allTransactions}]

		return res.status(200).json(userData)
	}
}








// async create(req: Request, res: Response) {
// 	const { username, password } = req.body
	
// 		 // verificando se Usename tem no minimo 3 caracteres
// 	const regexUsername = new RegExp(/^.{3,}$/)
// 	if(regexUsername.test(username) == false){
// 		console.log("Nome em formato incorreto")
// 		res.status(401).json("Nome em formato incorreto!")
// 	}

// 	//  verificando se o password tem os requisitps minimo de 1 minuscula, 1 maiscula, caracter especial, 1 numero, e no minimo 8 caracteres no total
// 	const regexPassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)  
// 	if(regexPassword.test(password) == false){
// 		console.log('Senha em formato incorreto')
// 		return res.status(401).json("Senha em formato incorreto")
// 	}
	

// 	//Busca por username no BD
// 	const userExists = await userRepository.findOneBy({ username })

// 	// verificando se o usuário já existe com base
// 	if (userExists) {
// 		throw new BadRequestError('Nome de usuario ja existe já existe')
// 	}

// 	//Encriptografando senha de usuário
// 	const hashPassword = await bcrypt.hash(password, 10)





	

// 	const newUser = userRepository.create({
// 		username,
// 		password: hashPassword
// 	})


// 	const verifyUserCreate = await userRepository.save(newUser)

// 	if (!verifyUserCreate) {
// 		return res.status(401).json("erro ao cirar usuario")
// 	} else {
// 		// criando uma conta nova para o usuario
// 		const newUserAccount = accountRepository.create({
// 			balance: 100
// 		})
// 		await accountRepository.save(newUserAccount)

// 		const idAccount = await accountRepository.query('SELECT MAX(id)  FROM  "Accounts"') as number
// 		const idUser = await userRepository.query('SELECT MAX(id)  FROM  "Users"') as number

// 		 await userRepository.createQueryBuilder().update("User").set({ accountId: idAccount }).where("id = :id", { id: idUser }).execute()
		


		

// 		return res.status(201).json({"usuario criado com sucesso"})
// 	}
	
// }