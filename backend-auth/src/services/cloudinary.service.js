import CLOUDINARY_CONFIG from "#server/configs/cloudinary.config";
import ENV_CONFIG from "#server/configs/env.config";

export async function uploadImageToCloudinary(file) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;

  const fileUri = await CLOUDINARY_CONFIG.uploader.upload(dataURI, {
    folder: ENV_CONFIG.CLOUDINARY_FOLDER_NAME,
  });

  return fileUri;
}

export async function deleteImageToCloudinary(public_id) {
  const id = public_id?.split("/")?.pop()?.split(".")?.[0];
  const url = await CLOUDINARY_CONFIG.uploader.destroy(
    ENV_CONFIG.CLOUDINARY_FOLDER_NAME + `/` + id
  );

  return url;
}
