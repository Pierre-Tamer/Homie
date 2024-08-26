import { BadRequestException, Injectable } from '@nestjs/common';
import { createProfileDto, EditProfileDto } from 'dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schema/user/user.schema';
import { PhotoService } from 'src/photo/photo.service';
import { Photo } from '../schema/abstract/photo.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private photoService: PhotoService,
  ) {}

  async getProfileById(id: string, { _id }: User): Promise<User> {
    return this.UserModel.findOne({ _id: id });
  }

  async createProfile(
    profileInfo: createProfileDto,
    profilePic: Express.MulterS3.File,
    user: UserDocument,
  ) {
    user.completeProfile = true;
    user.firstName = profileInfo.firstName.toLowerCase();
    user.lastName = profileInfo.lastName.toLowerCase();
    user.birthDay = profileInfo.birthDay;
    if (profilePic) {
      user.profilePhoto = new Photo(profilePic.key, `/photo/${profilePic.key}`);
    }

    await user.save();
  }

  async editProfile(
    editProfileDto: EditProfileDto,
    profilePic: Express.MulterS3.File,
    user: UserDocument,
  ): Promise<void> {
    user.firstName = editProfileDto.firstName
      ? editProfileDto.firstName
      : user.firstName;

    user.lastName = editProfileDto.lastName
      ? editProfileDto.lastName
      : user.lastName;

    user.birthDay = editProfileDto.birthDay
      ? editProfileDto.birthDay
      : user.birthDay;

    if (profilePic) {
      if (user.profilePhoto)
        this.photoService.deletePhoto(user.profilePhoto.name as any);
      user.profilePhoto = new Photo(profilePic.key, `/photo/${profilePic.key}`);
    }

    await user.save();
  }
}
