import { Router } from 'express'

import ProvidersController from '../controllers/ProvidersController'
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController'
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController'
import ensureAuthenticate from '@modules/users/infra/http/middleware/ensureAthenticated'

const ProvidersRouter = Router()
const providersController = new ProvidersController()
const providerMonthAvailability = new ProviderMonthAvailabilityController()
const providerDayAvailability = new ProviderDayAvailabilityController()

ProvidersRouter.use(ensureAuthenticate)

ProvidersRouter.get('/', providersController.index)
ProvidersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailability.index,
)
ProvidersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailability.index,
)
export default ProvidersRouter
