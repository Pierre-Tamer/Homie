import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as aws from 'aws-sdk';
import { Response } from 'express';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class PhotoService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  bucket = this.configService.get<string>('s3_bucket');

  s3 = new aws.S3({
    endpoint: this.configService.get<string>('s3_endpoint'),
    accessKeyId: this.configService.get<string>('s3_AccessKeyId'),
    secretAccessKey: this.configService.get<string>('s3_secretAccessKey'),
    s3ForcePathStyle: true,
  });

  deletePhoto(name: string): Promise<void> {
    this.s3.deleteObject(
      { Key: name, Bucket: this.bucket },
      function (err, data) {
        if (err) console.log(err, err.stack);
      },
    );
    return;
  }

  async getPhotoUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: 60 * 15,
    });
  }

  async getPhoto(id: string, res: Response) {
    const url = await this.getPhotoUrl(id);

    if (!url) throw new NotFoundException();

    if (process.env.NODE_ENV === 'development')
      res.redirect(
        302,
        url.replace('s3', this.configService.get<string>('SERVER_IP')),
      );
    else res.redirect(303, url);
  }
}
