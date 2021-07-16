import express from 'express'

//import routes
import authRouter from './auth'
import userRouter from './users'
import postRouter from './posts'
import uploadRouter from './upload'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('api endpoint')
})

//initialize routes
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/avatar', uploadRouter)

module.exports = router