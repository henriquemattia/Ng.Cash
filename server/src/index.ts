import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import { errorMiddleware } from './middlewares/error'
import routes from './routes'

import cors from 'cors'

AppDataSource.initialize().then(() => {
	const app = express()

	app.use(cors())

	app.use(express.json())

	app.use(routes)
	app.use(errorMiddleware)

	return app.listen(process.env.PORT, () => console.log('Servidor rodando'))
})
