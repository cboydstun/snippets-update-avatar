import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models'

const router = express.Router()

router
  .route('/:id')
  .get(async (request, response) => {
    const populateQuery = [
      {
        path: 'posts',
        populate: { path: 'author', select: ['username', 'profile_image'] },
      },
    ]

    const user = await User.findOne({ username: request.params.id })
      .populate(populateQuery)
      .exec()
    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .put(async (request, response) => {
    const { profile_image } = request.body
    const { id } = request.params

    try {
      const userUpdate = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          profile_image: profile_image,
        },
        {
          new: true,
        }
      )
      response.json(userUpdate.toJSON())
    } catch (error) {
      response.status(404).end()
    }
  })
  .put(async (request, response) => {
    const { password, profile_image } = request.body
    const { id } = request.params

    const hashedpassword = await bcrypt.hash(password, 12)

    try {
      const userUpdate = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          passwordHash: hashedpassword,
          profile_image: profile_image,
        },
        {
          new: true,
        }
      )
      response.json(userUpdate.toJSON())
    } catch (error) {
      response.status(404).end()
    }
  })

module.exports = router