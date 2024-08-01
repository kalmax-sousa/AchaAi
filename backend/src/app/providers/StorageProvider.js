import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "../../config/cloudinary.js";
import { promisify } from "util";
import fs from "fs";

class StorageProvider {
  constructor() {
    this.cloudinary = cloudinary;
    this.fs = fs;

    this.cloudinary.config(cloudinaryConfig);
  }

  async uploadOnCloud(file, previousImageUrl = null) {
    console.log(file);
    if (!file) {
      throw new Error("Arquivo não encontrado");
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Formato de imagem inválido");
    }

    if (previousImageUrl) {
      await this.deleteOnCloud(previousImageUrl);
    }

    const { path, originalname } = file;

    const uploadResult = await this.cloudinary.uploader
      .upload(path, {
        public_id: `${Date.now()}_${originalname}`,
      })
      .catch((error) => {
        throw new Error(error);
      });

    await this.deleteOnLocal(path);

    console.log(uploadResult);
    return uploadResult;
  }

  async deleteOnLocal(path) {
    return promisify(this.fs.unlink)(path);
  }

  async deleteOnCloud(image_url) {
    const public_id = image_url.split("/").pop().replace(/\.jpg/, "");

    await this.cloudinary.uploader.destroy(public_id).catch((error) => {
      throw new Error(error);
    });
  }
}

export default new StorageProvider();
