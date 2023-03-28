import multer from 'multer';
import cosmicjs from 'cosmicjs';

const {
  BUCKET_AVTARS,
  WRITE_KEY_AVATRS,
  BUCKET_PUBLICACOES,
  WRITE_KEY_PUBLICACOES
} = process.env;

const cosmic = cosmicjs();
const bucketAvatrs = cosmic.bucket({
  slug: BUCKET_AVTARS,
  write_key: WRITE_KEY_AVATRS
});
const bucketPublicacoes = cosmic.bucket({
  slug: BUCKET_PUBLICACOES,
  write_key: WRITE_KEY_PUBLICACOES
});

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const uploadImageCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer
    };
    if (req.url && req.url.includes('publicacao')) {
      return await bucketPublicacoes.addMedia({ media: media_object })
    } else {
      return await bucketAvatrs.addMedia({ media: media_object })
    }
  }
}

export { upload, uploadImageCosmic }
