import { Router } from 'express'
import { TransactionController } from './controllers/TransactionController'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

routes.get('/', new UserController().test)

routes.post('/register', new UserController().create)
routes.post('/login', new UserController().login)

routes.use(authMiddleware) // middleware de verificção de token | rotas abaixo só entra quem tiver token válido

routes.post('/transfer', new TransactionController().makeTransaction)

routes.get('/profile', new UserController().getProfile)

export default routes