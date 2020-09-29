import 'reflect-metadata'
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { errors } from 'celebrate'
import 'express-async-errors'

import routes from './routes'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'

import '@shared/container'
import '@shared/infra/typeorm'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)

app.use(errors())

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333, () => {
  console.log('Server started on port 3333!')
})
