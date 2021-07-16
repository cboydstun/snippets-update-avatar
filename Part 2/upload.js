//import dependencies
import express from 'express'
import multer from 'multer'
import { uuid } from 'uuidv4'

//initialize router
const router = express.Router()

//enable storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../client/public')
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-')
    cb(null, uuid() + '-' + fileName)
  },
})

//enable upload for multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png .jpg .jpeg allowed!'))
    }
  },
})

//@POST - /api/avatar/uploadAvatar - upload a single image as an avatar
router.post(
  '/uploadAvatar',
  upload.single('avatar'),
  async (req, res) => {
    try {
      res.status(201).send(req.file.path)
    } catch (error) {
      res.status(400).send('Avatar upload failed.')
    }
  }
)

module.exports = router