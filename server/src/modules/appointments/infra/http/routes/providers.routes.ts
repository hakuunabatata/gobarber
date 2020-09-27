import { Router } from 'express'

import ProvidersController from '../controllers/ProvidersController'
import ensureAuthenticate from '@modules/users/infra/http/middleware/ensureAthenticated'

const ProvidersRouter = Router()
const providersController = new ProvidersController()

ProvidersRouter.use(ensureAuthenticate)

ProvidersRouter.get('/', providersController.index)

export default ProvidersRouter
