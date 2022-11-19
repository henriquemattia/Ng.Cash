import { Router } from 'express'
import { TransactionController } from './controllers/TransactionController'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

routes.post('/register', new UserController().create)
routes.post('/login', new UserController().login)

routes.use(authMiddleware)

routes.post('/transfer', new TransactionController().makeTransaction)

routes.get('/profile', new UserController().getProfile)
                //FILTER
routes.get('/debited', new TransactionController().getDebitedTranfer)
routes.get('/credited', new TransactionController().getCreditedTranfer)





export default routes