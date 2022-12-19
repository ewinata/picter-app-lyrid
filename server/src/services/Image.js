const Multer = require('multer')
const { v4 } = require('uuid')
const path = require('path')
const S3 = require('aws-sdk/clients/s3')
const MulterS3 = require('multer-s3')
const dotenv = require('dotenv')

dotenv.config()

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true
})

const storage = MulterS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  key: function (req, file, callback) {
    callback(null, v4() + path.extname(file.originalname))
  }
})

const limits = {
  fileSize: 1024 * 1024 * 5
}

const fileFilter = function (req, file, callback) {
  const allowedTypes = ['image/jpg', 'image/jpeg']
  if (!allowedTypes.includes(file.mimetype)) {
    callback(new Error('Invalid file type'), false)
  }
  callback(null, true)
}

/**
 * Get image
 */
const getObject = async (path) => {
  const url = await s3.getSignedUrl(
    'getObject',
    {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: path,
      Expires: 999999
    }
  )

  return url
  // const data = await s3.getObject().promise();
  //
  // return data.Body.toString(utf-8);
}

/**
 * Function to upload images
 */
const imageUpload = () => {
  return new Multer({ storage, fileFilter, limits })
}

/**
 * Function to delete images
 * @param file
 * @return true | false
 */
const deleteImage = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: file
  }
  try {
    const result = await s3
      .deleteObject(params, function (err, data) {
        if (err) return err
        else return data
      })
      .promise()
    console.log('Resp: ', result)
    return true
  } catch (err) {
    console.log('Error: ', err)
    return false
  }
}

module.exports = { imageUpload, deleteImage, getObject }
