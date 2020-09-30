import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import AppointmentsController from '../controllers/AppointmentsController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'
import ensureAuthenticate from '@modules/users/infra/http/middleware/ensureAthenticated'

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsController()
const providerAppointmentsController = new ProviderAppointmentsController()

appointmentsRouter.use(ensureAuthenticate)

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
)
appointmentsRouter.get('/me', providerAppointmentsController.index)

export default appointmentsRouter
