import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '../config/upload'
import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

import ensureAthenticated from '../middleware/ensureAthenticated'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const createUser = new CreateUserService()

    const user = await createUser.execute({
      name,
      email,
      password,
    })

    const retUser = {
      name,
      email,
    }

    return res.json(retUser)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

usersRouter.patch(
  '/avatar',
  ensureAthenticated,
  upload.single('avatar'),

  async (req, res) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService()

      const user = await updateUserAvatar.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      })

      return res.json(user)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  },
)

export default usersRouter
