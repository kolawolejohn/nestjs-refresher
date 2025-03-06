import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const uploadResult = await this.uploadToCloudinary(file.path);
      const newlySavedFile = await this.prisma.fileUpload.create({
        data: {
          filename: file.originalname,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });
      fs.unlinkSync(file.path);
      return newlySavedFile;
    } catch (error) {
      //removing in case of any error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new InternalServerErrorException(
        'File upload failed please try again after some time',
        error.message,
      );
    }
  }

  private async uploadToCloudinary(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) {
          console.error('Error while uploading media to cloudinary', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  deleteMediaFromCloudinary = async (fileId: string) => {
    try {
      const file = await this.prisma.fileUpload.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException(
          'File not found, please try with a different fileId',
        );
      }
      await cloudinary.uploader.destroy(file.publicId);
      await this.prisma.fileUpload.delete({
        where: { id: fileId },
      });

      console.log(
        'Media deleted succesfully from cloud storage',
        file.publicId,
      );
      return { message: 'file deleted successfully' };
    } catch (error) {
      console.error('Error deleting media from cloudinary', error);
      throw error;
    }
  };
}
