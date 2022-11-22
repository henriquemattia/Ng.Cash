// import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const port = Number(5444) as number | undefined

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: port,
	username: 'henrique',
	password: 'henrique',
	database: 'ngcash',
	entities: [`${__dirname}/**/entities/*.{ts,js}`],
	migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
})

// const port = process.env.DB_PORT as number | undefined

// export const AppDataSource = new DataSource({
// 	type: 'postgres',
// 	host: process.env.DB_HOST,
// 	port: port,
// 	username: process.env.DB_USER,
// 	password: process.env.DB_PASS,
// 	database: process.env.DB_NAME,
// 	entities: [`${__dirname}/**/entities/*.{ts,js}`],
// 	migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
// })


