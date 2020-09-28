import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService'

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id
    const { day, month, year } = req.body

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentService,
    )

    const appointments = await listProviderAppointments.execute({
      day,
      month,
      year,
      provider_id,
    })

    return res.json(appointments)
  }
}
