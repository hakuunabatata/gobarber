import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService'

export default class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params
    const { month, year } = req.query

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    )

    // console.log({ month, year })
    // console.log(provider_id)

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    })

    // console.log(availability)

    return res.json(availability)
  }
}
