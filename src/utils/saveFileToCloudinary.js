import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function saveFileToCloudinary(buffer, folderName, userId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `user-app/${folderName}`,
        resource_type: 'image',
        public_id: `${folderName}_${userId}`,
        overwrite: true,
        unique_filename: false,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}
